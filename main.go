package main

import (
	"embed"
	"encoding/json"
	"flag"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/signal"
	"regexp"
	"strconv"
	"syscall"

	vueglue "github.com/torenware/vite-go"
)

var (
	pidFile string
	vueGlue *vueglue.VueGlue
)

//go:embed dist
var dist embed.FS

// 不搭建静态服务器的话，用这个go进程搭建一个静态服务器，当然还可以编写路由实现动态服务
func main() {
	flag.StringVar(&pidFile, "pid-file", "x.pid", "Write the current process ID to the file and wait for a signal to delete it")
	flag.Parse()

	// If pidFile is set, write the current process ID to the file and wait for a signal to delete it
	if pidFile != "" {
		pid := strconv.Itoa(os.Getpid())
		_ = ioutil.WriteFile(pidFile, []byte(pid), 0644)
		waitForSignal()

		defer DeletePidFile()
	}

	// Production configuration
	config := &vueglue.ViteConfig{
		Environment: "production",
		AssetsPath:  "dist",	// vue 编译后的文件目录
		// EntryPoint:  "src/main.js",
		Platform:    "vue",
		FS:          dist, // Use the embed.
	}

	glue, err := vueglue.NewVueGlue(config)
	if err != nil {
		panic(err)
	}
	vueGlue = glue

	mux := http.NewServeMux()

	fsHandler, err := vueGlue.FileServer()
	if err != nil {
		panic(err)
	}
	mux.Handle(config.URLPrefix, fsHandler)	// 静态文件

	mux.HandleFunc("/", logRequest(http.HandlerFunc(pageWithAVue)))

	log.Println("Listening on :8080")
	generatedConfig, _ := json.MarshalIndent(config, "", "  ")
	log.Println("Vite config: ", string(generatedConfig))
	err = http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal(err)
	}
}

func DeletePidFile() {
	if pidFile != "" {
		err := os.Remove(pidFile)
		if err != nil {
			fmt.Println("could not Delete pid file: %v", err)
		}
	}
}

func logRequest(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s - %s %s", r.RemoteAddr, r.Method, r.URL)
		next(w, r)
	})
}

func pageWithAVue(w http.ResponseWriter, r *http.Request) {
	re := regexp.MustCompile(`^/([^.]+)\.(svg|ico|jpg)$`)
	matches := re.FindStringSubmatch(r.RequestURI)
	if matches != nil {
		http.ServeFile(w, r, matches[1]+"."+matches[2])
		return
	}

	// New you can pass the glue object to an HTML	template
	ts, err := template.ParseFiles("template.tmpl")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	ts.Execute(w, vueGlue)
}

func waitForSignal() {
	if pidFile == "" {
		return
	}

	pidDeleteChan := make(chan os.Signal, 1)
	signal.Notify(pidDeleteChan, os.Interrupt, syscall.SIGTERM) // Listen for interrupt and terminate signals
	go func() {
		<-pidDeleteChan
		DeletePidFile()
		os.Exit(0)
	}()
}
