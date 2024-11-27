# #extra 常用的命令

>  在系列教程中提及的命令, 单独出篇文章方便查找. 

## 视频/音频转码

### 命令

```bat
ffmpeg -i <输入文件> <输出文件>
```

### 示例

#### mp3 -> flac

> > 因为大部分视频格式都可以使用转封装进行转化, 所以使用音频作为示例. 
>
> 将 `.flv` 格式的视频转封装为 `.mp4` 格式的音频: 

```bat
ffmpeg -i "input.mp3" -c:a flac "output.flac"
```

---

#### flv(H.264) -> mp4(H.265)

> 将 `H.264(AVC)` 编码的 `.flv` 格式的视频转封装为 `H.265(HEVC)` 编码的 `.mp4` 格式的视频: 

```bat
ffmpeg -i "input.flv" -c:v libx265 -c:a aac "output.mp4"
```



## 视频/音频转封装

### 命令

```bat
ffmpeg -i <输入文件> -c copy <输出文件>
```

### 示例

#### flv -> mp4

> 将 `.flv` 格式的视频转封装为 `.mp4` 格式的视频: 

```bat
ffmpeg -i "input.flv" -c copy "output.mp4"
```

---

#### ts -> mp4

> 将 `.flv` 格式的视频转封装为 `.mp4` 格式的视频: 

```bat
ffmpeg -i "input.ts" -c copy "output.mp4"
```

---

#### mkv -> mp4

> 将 `.mkv` 格式的视频转封装为 `.mp4` 格式的视频: 

```bat
ffmpeg -i "input.mkv" -c copy "output.mp4"
```



## 单独提取视频

### 命令

```bat
ffmpeg -i <输入文件> -an -c:v copy <输出文件>
```

### 示例

#### 提取没有音频的视频流

```bat
ffmpeg -i "input.mp4" -an -c:v copy "output.mp4"
```



## 单独提取音频

### 命令

```bat
ffmpeg -i <输入文件> -vn -c:a copy <输出文件>
```

### 示例

#### 提取音频

> 忽略视频流, 对音频流进行复制

```bat
ffmpeg -i "input.mp4" -vn -c:a copy "output.aac"
```

---

#### 提取音频, 并将其转码为 mp3 格式

> 忽略视频流, 对音频流进行转码

```bat
ffmpeg -i "input.mp4" -vn -c:a mp3 "output.mp3"
```

