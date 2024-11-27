# #1 安装 FFMPEG

> 本系列教程基于 `Window` 系统, 其它系统需根据情况进行修改. 

## 下载

访问 [官网](https://ffmpeg.org/download.html) , 不要点击最上面的 `Download Source Code` 按钮, 点击左下角的 window 图标, 然后会出现两个链接, 随便挑一个点击跳转到对应的链接下载. 

![image-20241127161650873](./iamges_1_%E5%AE%89%E8%A3%85ffmpeg/image-20241127161650873.png)



### [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)

该链接会跳转到一个网页, 在该网页中找到内容 `ffmpeg-git-full.7z` , 点击下载. 

![image-20241127162344662](./iamges_1_%E5%AE%89%E8%A3%85ffmpeg/image-20241127162344662.png)

### [BtbN](https://github.com/BtbN/FFmpeg-Builds/releases)

该链接会跳转到一个 Github 页面, 在该页面找到名为 `ffmpeg-master-latest-win64-gpl.zip` 的文件, 点击下载. 

![image-20241127162206747](./iamges_1_%E5%AE%89%E8%A3%85ffmpeg/image-20241127162206747.png)

## 安装

> 这里以通过 [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) 下载的文件示例, 通过其它方式下载的也可以以此类推. 

### 解压文件

下载下来是一个压缩包, 名字类似于 `ffmpeg-xxxx-xx-xx-git-xxxxxxxxxxxx-full_build.7z` . 

解压下来的文件夹内容为: 

```plain
ffmpeg-xxxx-xx-xx-git-xxxxxxxxxxxx-full_build
│
│  LICENSE
│  README.txt
│
├─bin
│      ffmpeg.exe
│      ffplay.exe
│      ffprobe.exe
│
├─doc
│
└─presets
```

其中的文件夹 `bin` 中的三个 `.exe` 文件, 就是我们需要的文件. 其它可以不用管, 不过在文章结尾会进行简单的介绍, 如果感兴趣可以看看. 

这里简单的介绍一个这三个文件: 

- `ffmpeg.exe`: 这是之后 **音视频操作** 需要使用到的工具, 通过该工具可以对流媒体进行操作. 	
- `ffprobe.exe`: 这是一个可以 **获取视频详细信息** 的工具.
- `ffplay.exe`: 这是一个视频播放器, 所以该工具其实没什么用.  



### 设置环境变量

> 在设置环境变量之前, 可以将 `ffmpeg-xxxx-xx-xx-git-xxxxxxxxxxxx-full_build` 文件夹转移到一个方便管理的文件夹中.
> (只移动 `bin` 文件夹也可以)
>
>  在本教程中, `bin` 文件夹的地址为: `E:\ffmpeg\bin` .

1. 按下 `win+r` 键, 打开 **[运行]** 窗口. 
2. 在 **[运行]** 窗口中输入指令: `sysdm.cpl`, 点击 **[确认]** , 打开 **[系统属性-高级]** 窗口. 
3. 点击 **[环境变量]** 按钮, 打开 **[环境变量]** 窗口. 
4. 在 **[系统变量]** 中找到 `Path` 一栏, 点击 **[编辑]** 按钮, 打开 **[编辑环境变量]** 窗口. 
5. 点击 **[新建]** 按钮, 在输入框中输入 `bin` 目录的地址, 在本教程中为: `E:\ffmpeg\bin` .
6. 在打开的所有窗口中, 依次点击 **[确定]**. 

![image-20241127172153778](./iamges_1_%E5%AE%89%E8%A3%85ffmpeg/image-20241127172153778.png)

### 验证安装

> 在某些特殊情况下, 环境变量需要重启电脑后才会生效. 
>
> 如果验证安装不成功, 先重启一下电脑看看. 

1. 按下 `win+r` 键, 打开 **[运行]** 窗口. 
2. 在 **[运行]** 窗口中输入指令: `sysdm.cpl`, 点击 **[确认]** , 打开 **[命令行]** 窗口.
3. 在出现的 **[命令行]** 窗口中输入以下内容: 

```bat
ffmpeg -version
```

---

- 如果出现内容, 即为安装成功: 

```bat
ffmpeg version xxxx-xx-xx-git-xxxxxxxxxxxx-full_build-www.gyan.dev Copyright (c) 2000-2024 the FFmpeg developers
built with gcc 14.2.0 (Rev1, Built by MSYS2 project)
configuration: .............
```

- 如果安装失败, 会提示:

```bat
'ffmpeg' 不是内部或外部命令，也不是可运行的程序
或批处理文件。
```

![image-20241127170400657](./iamges_1_%E5%AE%89%E8%A3%85ffmpeg/image-20241127170400657.png)



## ffmpeg文件夹结构

```plain
ffmpeg-xxxx-xx-xx-git-xxxxxxxxxxxx-full_build
│
│  LICENSE
│  README.txt
│
├─bin
│      ffmpeg.exe
│      ffplay.exe
│      ffprobe.exe
│
├─doc
│
└─presets
```

#### README.txt

该文件是软件的说明文件, 会对该软件进行简单的文件介绍. 

#### LICENSE

该文件 ffmpeg 的许可证, 使用的是 GPL-3 协议. 

> 关于许可证(License), 感兴趣可以看这篇文章: [深入理解开源许可证（Apache,MIT,GPL,BSD,CC）](https://github.com/shaokeyibb/open-source-licenses-in-depth/blob/master/Open-Source-License-In-Depth.md)

### presets

该文件夹下保存了一些 ffmpeg 的**预设文件**, 因为是较为高阶的内容, 所以本教程不会涉及这部分内容. 

关于预设文件感兴趣可以参阅官方文档: [Preset files](https://ffmpeg.github.net.cn/ffmpeg.html#Preset-files). 

### doc

该文件夹下是一份英文的离线文档, 打开该文件夹下的任意 `.html` 文件即可打开对应的文档. 



## 官方文档

> - 官网: https://ffmpeg.org/download.html
> - 英文文档: https://ffmpeg.org/documentation.html
> - 中文文档: https://ffmpeg.github.net.cn/documentation.html