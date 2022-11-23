package utils

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
)

const TokenExpireDuration = time.Hour * 24 // 设置过期时间
var JwtKeyed = []byte(JwtKey)              // JWT密钥

// MyClaims 自定义jwt中保存哪些数据
type MyClaims struct {
	Username           string `json:"username"`
	jwt.StandardClaims        // 内嵌声明标准
}

// GenToken 生成JWT
func GenToken(username string) (string, int) {
	// 创建声明
	c := MyClaims{
		username,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(TokenExpireDuration).Unix(), // 过期时间
			Issuer:    "Han-blog",                                 // 签发人
		},
	}
	// 使用指定方式创建签名对象
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	// 使用指定的密钥签名并获得完整的编码后的字符串token
	tokenString, err := token.SignedString(JwtKeyed)
	if err != nil {
		return "", CodeError
	}
	return tokenString, CodeSuccess
}

// ParseToken 解析JWT
func ParseToken(tokenString string) (*MyClaims, error) {
	// 解析token
	token, err := jwt.ParseWithClaims(tokenString, &MyClaims{}, func(token *jwt.Token) (interface{}, error) {
		return JwtKeyed, nil
	})
	if err != nil {
		return nil, err
	}
	// 对token对象中的Claims进行类型断言
	if claims, ok := token.Claims.(*MyClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}
