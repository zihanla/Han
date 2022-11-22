package utils

// 定义状态码
const (
	CodeSuccess = 200
	CodeError   = 500

	CodeUserNotExist      = 1001 // 用户不存在
	CodeUserPasswordWrong = 1002 // 用户密码错误
	CodeTokenNotExist     = 1003 // Token不存在
	CodeTokenWrong        = 1004 // Token不正确
	CodeTokenRunTime      = 1005 // Token已过期

	CodeArtNotExist = 2001 // 该文章不存在

	CodeTagNotExist = 3001 // 该标签不存在
	CodeTagUsed     = 3002 // 该标签已存在

	CodeInvalidParam = 4001 // 请求参数错误
)

// 给状态码指定状态信息
var codeMsg = map[int]string{
	CodeSuccess: "ok",
	CodeError:   "fail",

	CodeUserNotExist:      "用户不存在",
	CodeUserPasswordWrong: "用户账号或密码错误",
	CodeTokenNotExist:     "Token不存在",
	CodeTokenWrong:        "Token不正确",
	CodeTokenRunTime:      "Token已过期",

	CodeArtNotExist: "该文章不存在",
	CodeTagNotExist: "该标签不存在",

	CodeTagUsed: "该标签已存在",

	CodeInvalidParam: "请求参数错误",
}

// GetMsg 根据状态码获取状态信息
func GetMsg(code int) string {
	return codeMsg[code]
}
