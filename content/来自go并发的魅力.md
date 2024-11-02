---
title: "来自go并发的魅力"
author: "子涵"
slug: "go-concurrency"
date: 2022-09-27
---

> 学 C、Java 时都没有能力了解线程相关的东西(我是菜鸡)，玩 go 时终于可以体验以下了(实现简单)。

## 简单认识

> 假设你要做两件事：洗衣服、做饭，下面是三种方案

- 串行：先洗完衣服再做饭，或者先做饭再洗衣服
- 并发：洗会儿衣服，做会儿饭，直到都搞完(先后顺序不定，两边跑，想到啥搞啥，情景自己脑补)
- 并行：在厨房洗衣服，一只手做饭，一只手洗衣服

## 栗子 1.0

```go
package main

import (
	"fmt"
	"time"
)

func do1() {
	time.Sleep(1 * time.Second)
	fmt.Println("暂停1s")
}

func do2() {
	time.Sleep(2 * time.Second)
	fmt.Println("暂停2s")
}

func main() {
	// 开始时间
	start := time.Now()
	// 分别执行do1、2, 五次
	for i := 0; i < 5; i++ {
		do1()
		do2()
	}

	// 结束时间
	end := time.Now()
	// 总耗时
	fmt.Println("总耗时->", end.Sub(start)) // end.Sub(start) 开始时间 - 结束时间 = 总耗时-> 15.0657871s
}

```

## 栗子 2.0

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

// sync.waitGroup
var wg sync.WaitGroup

func do1() {
	defer wg.Done()
	time.Sleep(1 * time.Second)
	fmt.Println("暂停1s")
}

func do2() {
	defer wg.Done() // wg.Add(-1) 计数器值 -1
	time.Sleep(2 * time.Second)
	fmt.Println("暂停2s")
}

func main() {
	// 开始时间
	start := time.Now()
	// 分别执行do1、2, 五次
	for i := 0; i < 5; i++ {
		wg.Add(2) // 执行两个并发任务,计数器值 +2
		go do1()
		go do2()
	}
	wg.Wait() // 阻塞  直到上面程序结束(计数器值为0) 然后继续执行下面程序
	// 结束时间
	end := time.Now()
	// 总耗时
	fmt.Println("总耗时->", end.Sub(start)) // end.Sub(start) 开始时间 - 结束时间 = 总耗时-> 2.010531s
}

```

> 原作者 zxysilent ，很形象所以拿过来，方便理解

- [来源](https://blog.zxysilent.com/post/goweb-03-6.html)
