
/**
 * 登录请求参数
 */
export interface LoginData{
    username: string;
    password: string;
    // 验证码缓存key
    captchaKey?: string;
    // 验证码
    captchaCode?: string;
};

/**
 * 登录返回数据
 */
export interface LoginResult{
    accessToken?: string;
    refreshToken?: string;
    // 过期时间
    expire?: number;
    // 刷新过期时间
    refreshExpire?: number;
    tokenType?: string;
};

/**
 * 验证码响应
 */
export interface CaptchaResult{
    captchaKey: string;
    captchaBase64: string;
};
