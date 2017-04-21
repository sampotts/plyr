# Plyr
一个简单、触手可及、可定制的HTML5、YouTube、VIMEO媒体播放器。

[捐献支持](#捐献)

[检测演示](https://plyr.io)

[![Plyr图像](https://cdn.selz.com/plyr/plyr_v1.8.9.png)](https://plyr.io)

## 初衷
我们想要一个轻量级，触手可及和可定制的媒体播放器，支持[*现代*](#浏览器支持)浏览器。当然，还有很多其他的播放器，但是我们希望保持简洁的风格，使用正确的元素来完成播放工作。

## 特征
- **触手可及** - 完全支持VTT字幕和屏幕阅读器
- **轻量级** - 缩小并压缩后小于10KB
- **[可定制](#html)** - 让播放器拥有您想要的标签
- **语义化** - 使用 *正确* 的元素。`<input type="range">`用于音量，`<progress>`用于进度，以及`<button>`用于按钮。没有`<span>`或`<a href="#">`按钮
- **响应式** - 可在任何尺寸屏幕下运行
- **HTML音频和视频** - 支持这两种格式
- **[嵌入式视频](#嵌入功能)** - 支持YouTube和Vimeo视频播放
- **[流式传输](#流媒体)** - 支持hls.js，Shaka和dash.js流式回放
- **[API接口](#api)** - 切换回放，音量，搜索等功能
- **[支持事件](#事件)** - 不要混淆Vimeo和YouTube API，所有事件都跨格式标准化
- **[全屏](#全屏)** - 支持本机全屏，进入“全窗口”模式
- **[快捷键](#快捷键)** - 支持键盘快捷键
- **支持i18n** - 支持标准化控制器
- **无依赖库** - 写在“vanilla”JavaScript文件中，不需要jQuery
- **SASS和LESS** - 包含在您的构建过程中

是的，它是与Bootstrap一起运行。

## 修改日志
查看[修改日志](changelog.md)，了解Plyr的新功能。

## 目前正在开发的功能
- 播放速度选择
- 质量选择
- 字幕语言选择
- AirPlay（音乐播放器）
- 画中画 (MacOS Sierra + Safari)

[更多信息](https://github.com/Selz/plyr/issues?q=is%3Aissue+is%3Aopen+label%3A%22In+Development%22)

## 计划功能
- 播放列表
- Google cast
- 支持脸书视频
- 支持Wistia视频
- 支持YouTube 和 Vimeo 音频
- 音频字幕
...以及其他任何[问题](https://github.com/Selz/plyr/issues)

如果您有任何比较酷的想法或功能设计的构想，请通过[创建问题](https://github.com/Selz/plyr/issues/new)或者分配和发送拉取请求来通知我。

## CMS 插件

### [WordPress](https://wordpress.org/plugins/plyr/)
由Ryan Anthony Drake创建并维护（[@iamryandrake](https://github.com/iamryandrake)）

### [Neos](https://packagist.org/packages/jonnitto/plyr)
由Jon Uhlmann创建和维护 ([@jonnitto](https://github.com/jonnitto))

### [Kirby](https://github.com/dpschen/kirby-plyrtag)
由Dominik Pschenitschni 创建和维护 ([@dpschen](https://github.com/dpschen))

## Using package managers
您可以使用以下软件包管理器之一来获取源代码。

### npm
```
npm install plyr
```
[https://www.npmjs.com/package/plyr](https://www.npmjs.com/package/plyr)

### Bower
```
bower install plyr
```
[http://bower.io/search/?q=plyr](http://bower.io/search/?q=plyr)

有关设置依赖关系的更多信息可以在这里找到 [Bower文档](http://bower.io/docs/creating-packages/#maintaining-dependencies)

### Ember
The awesome [@louisrudner](https://twitter.com/louisrudner) has created an ember component, available by running:
```
ember addon:install ember-cli-plyr
```
更多信息，参见 [npm](https://www.npmjs.com/package/ember-cli-plyr) 和 [GitHub](https://github.com/louisrudner/ember-cli-plyr)

## 快速创建
这是一个快速创建的起步和运行说明。这里还有一个[Codepen上的在线演示案例](http://codepen.io/sampotts/pen/jARJYp).

### HTML
Plyr 是标准的HTML5标记语言的拓展，所以它有你对于这些类型所需要的一切。有关高级HTML标记的更多信息，请参见 [初始化](#初始化)。

#### HTML5 视频
```html
<video poster="/path/to/poster.jpg" controls>
	<source src="/path/to/video.mp4" type="video/mp4">
  	<source src="/path/to/video.webm" type="video/webm">
  	<!-- Captions are optional -->
  	<track kind="captions" label="English captions" src="/path/to/captions.vtt" srclang="en" default>
</video>
```

#### HTML5 音频
```html
<audio controls>
  	<source src="/path/to/audio.mp3" type="audio/mp3">
  	<source src="/path/to/audio.ogg" type="audio/ogg">
</audio>
```

对于 YouTube 和 Vimeo，Plyr 使用标准的 YouTube API 标记语言（一个空的`<div>`）：

#### YouTube 嵌入
```html
<div data-type="youtube" data-video-id="bTqVqk7FSmY"></div>
```

注意：data-video-id 的值现在是视频的ID或URL。此属性名称将在以后的版本中更改以反映此更改。

#### Vimeo 嵌入
```html
<div data-type="vimeo" data-video-id="143418951"></div>
```
注意：data-video-id 的值现在是视频的ID或URL。此属性名称将在以后的版本中更改以反映此更改。

### JavaScript 
在闭合`</body>`标签之前包含`plyr.js`script文件，然后调用`plyr.setup()`方法。有关`setup()`的更多信息参见[初始化](#初始化)。

```html
<script src="path/to/plyr.js"></script>
<script>plyr.setup();</script>
```

如果你想使用我们的 CDN (由[Fastly](https://www.fastly.com/)提供)来获取JavaScript文件，你可以使用一下代码：

```html
<script src="https://cdn.plyr.io/2.0.12/plyr.js"></script>
```

### CSS
在你的`<head>`头文件中包含 `plyr.css` CSS文件。

```html
<link rel="stylesheet" href="path/to/plyr.css">
```

如果你想使用我们的 CDN (由[Fastly](https://www.fastly.com/)提供)来获取默认的CSS文件，你可以使用一下代码：

```html
<link rel="stylesheet" href="https://cdn.plyr.io/2.0.12/plyr.css">
```

### SVG 子画面
SVG 子画面是从我们的CDN(由 [Fastly](https://www.fastly.com/)提供)中自动加载的。为了更改这个，详见下面的[参数](#参数)。作为参考，CDN托管的SVG子画面可以在这里找到：`https://cdn.plyr.io/2.0.12/plyr.svg`。
## 高级

### LESS & SASS/SCSS
您可以使用`plyr.less`或`plyr.scss`文件包含在`/src`目录中作为你的构建的一部分，并根据你的设计更改变量。LESS和SASS要求您使用[autoprefixer插件](https://www.npmjs.com/package/gulp-autoprefixer)（你应该准备），因为所有declerations都使用W3C标准 - 例如，`appearance: none;`会通过autoprefixer被加上前缀`-webkit-appearance: none;`。

HTML标记语言使用BEM方法使`plyr`作为块状元素，例如，`.plyr__controls`。你可以更改选项中的类钩子函数以匹配您编写的任何自定义CSS。查看JavaScript源代码了解更多有关信息。

### SVG
Plyr控制器使用的icon图标是从SVG子图像中加载的。这个子图像默认地是从我们的CDN上自动加载的。如果你已经有自己的一套icon图标，你可以将它包含在Plyr图标源目录中(详见用于源图标的 `/src/sprite` 目录)。

#### 使用 `iconUrl` 参数
你可以指定自己的`iconUrl`参数。如果这个URL是绝对路径，由于当前浏览器的限制，Plyr将确定由AJAX / CORS加载；或者是相对路径，只需直接使用该路径。

如果你在网站上使用`<base>` 标签，则可能需要使用以下内容：
[svgfixer.js](https://gist.github.com/leonderijke/c5cf7c5b2e424c0061d2)

更多有关SVG子图像的信息参考这里：
[http://css-tricks.com/svg-sprites-use-better-icon-fonts/](http://css-tricks.com/svg-sprites-use-better-icon-fonts/)
AJAX 技术参考这里：
[http://css-tricks.com/ajaxing-svg-sprite/](http://css-tricks.com/ajaxing-svg-sprite/)

### 跨域问题 (CORS)
您会注意到示例中`<video>`元素的`crossorigin`属性。这是因为TextTrack字幕是从另一个域加载的。如果您的TextTrack字幕也托管在另一个域上，则需要添加此属性，并确保您的主机具有正确的文件头设置。有关CORS检查MDN文档的更多信息，请访问：
[https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

### 字幕
支持WebVTT字幕。添加字幕轨，请参照上面的HTML示例并查看`<track>`元素。确保[验证你的字幕文件](https://quuz.org/webvtt/)。

### JavaScript

#### 初始化

默认情况下，`setup()`会找到document中所有`<video>`， `<audio>`和`[data-type]`元素，并初始化找到的元素。找到的每个目标媒体元素将被包装在一个单独`<div>`中设置样式和创建。您可以指定`setup()`的各种参数来使用，包括不同的NodeList，HTMLElement，HTMLElements数组或字符串选择器，如下所示：

传入一个[NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList):
```javascript
plyr.setup(document.querySelectorAll('.js-player'), options);
```

传入一个 [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement):
```javascript
plyr.setup(document.querySelector('.js-player'), options);
```

传入一个 [HTMLElement](https://developer.mozilla.org/en/docs/Web/API/HTMLElement)的[数组](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)：
```javascript
plyr.setup([
	document.querySelector('.js-player-1'),
	document.querySelector('.js-player-2')
], options);
```

传入一个 [string selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll):
```javascript
plyr.setup('.js-player', options);
```

NodeList, HTMLElement 或者字符选择器可以是 `<video>`标签，`<audio>`标签或者 `[data-type]` （用于嵌入）元素本身或者一个容器元素。

只传入参数对象：
```javascript
plyr.setup(options);
```

`setup()` 会返回一个*实例*数组，实例可以使用 [API](#api)方法。更多信息详见[API](#api)这一节。
#### 触摸范围
一些触摸浏览器（尤其是iOS上的移动Safari浏览器）似乎有一些`<input type="range">`元素的问题，触摸轨迹设置值不起作用，滑动拇指可能会很棘手。为了解决这个问题，我创建了[RangeTouch](https://rangetouch.com)，我建议你包括在你的解决方案中。这是一个很小的脚本，对于触摸设备上的用户来说，这是非常有益的。

#### 参数
参数必须像上面介绍的那样作为一个对象传入`setup()`方法，或者作为一个JSON数据传入你的每个标签元素中`data-plyr`属性中：

```html
<video data-plyr='{ title: "testing" }'></video>
```

注意，单引号封装JSON，双引号封装对象的键。

<table class="table" width="100%">
  <thead>
    <tr>
      <th width="20%">参数</th>
      <th width="15%">类型</th>
      <th width="15%">默认值</th>
      <th width="50%">描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>enabled</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>完全禁用Plyr。这将允许您执行用户代理检查或类似操作以编程方式启用或禁用某个确定用户代理的Plyr。例子如下。</td>
    </tr>
    <tr>
      <td><code>html</code></td>
      <td>String</td>
      <td><code><a href="controls.md">详见 controls.md</a></code></td>
      <td>更多关于如何搭建<code>html</code>的信息详见 <a href="controls.md">controls.md</a> 。</td>
    </tr>
    <tr>
      <td><code>controls</code></td>
      <td>Array</td>
      <td><code>['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'fullscreen']</code></td>
      <td>切换使用默认控件html时要显示的控件元素。如果指定一个<code>html</code>选项，这是多余的。默认值是显示所有内容。</td>
    </tr>
    <tr>
      <td><code>i18n</code></td>
      <td>Object</td>
      <td><code><a href="controls.md">See controls.md</a></code></td>
      <td>按钮中使用国际化（internationalization，缩写为i18n）的工具提示/标签。</td>
    </tr>
    <tr>
      <td><code>loadSprite</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>加载<code>iconUrl</code>参数（如果是一个URL地址）指定SVG子图像。如果设置为<code>false</code>，它会假设你自己控制图像加载。</td>
    </tr>
    <tr>
      <td><code>iconUrl</code></td>
      <td>String</td>
      <td><code>null</code></td>
      <td>指定 SVG 图像的一个URL地址或者路径。更多信息详见<a href="#svg">SVG 章节</a>。</td>
    </tr>
    <tr>
      <td><code>iconPrefix</code></td>
      <td>String</td>
      <td><code>plyr</code></td>
      <td>为默认控件中使用的图标指定ID前缀（例如“plyr-play”将为“plyr”）。这是为了防止你使用自己的SVG图像但使用默认控件产生冲突。大多数人可以忽略此参数。</td>
    </tr>
    <tr>
      <td><code>blankUrl</code></td>
      <td>String</td>
      <td><code>https://cdn.selz.com/plyr/blank.mp4</code></td>
      <td>指定一个空白视频文件的URL地址或者路径，用来正确得取消网络请求。更多信息详见<a href="https://github.com/Selz/plyr/issues/174">174号问题</a> 。</td>
    </tr>
    <tr>
      <td><code>debug</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>显示Plyr正在运行的调试信息。</td>
    </tr>
    <tr>
      <td><code>autoplay</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>自动播放载入媒体。这通常是建议基于用户体验来设置。它也在iOS上禁用（苹果限制）。</td>
    </tr>
    <tr>
      <td><code>seekTime</code></td>
      <td>Number</td>
      <td><code>10</code></td>
      <td>当用户快速前进或快退时，以秒为单位的寻找时间。</td>
    </tr>
    <tr>
      <td><code>volume</code></td>
      <td>Number</td>
      <td><code>5</code></td>
      <td>1到10之间的数字，表示播放器的初始音量。</td>
    </tr>
    <tr>
      <td><code>clickToPlay</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>单击（或点击）视频容器将切换暂停/播放。</td>
    </tr>
    <tr>
      <td><code>disableContextMenu</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>禁用视频上的右键菜单，以帮助您进行非常原始的模糊处理，以防止内容下载。</td>
    </tr>
    <tr>
      <td><code>hideControls</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>当 鼠标没有对焦移动，播放开始，进入全屏，控制元素模糊（标签输出）两秒后，自动隐藏播放控件。一旦鼠标移动，控制元素被聚焦或播放暂停，控件立即重新出现。</td>
    </tr>
    <tr>
      <td><code>showPosterOnEnd</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>一旦播放完成，将恢复和*重新加载* HTML5视频。注意：根据浏览器缓存，这可能会导致视频再次下载（或其中的一部分）。谨慎使用。</td>
    </tr>
    <tr>
      <td><code>keyboardShortcuts</code></td>
      <td>Object</td>
      <td><code>{ focused: true, global: false }</code></td>
      <td>对指定的播放器单独或者全局激活<a href="#快捷键">键盘快捷键</a>(只有当document中只有一个播放器时才有效)。</td>
    </tr>
    <tr>
      <td><code>tooltips</code></td>
      <td>Object</td>
      <td><code>{ controls: false, seek: true }</code></td>
      <td>
  		<strong>controls</strong>: 在:hover和:focus时显示控件的文本标签作为工具提示（默认地，文本标签只是屏幕阅读器）。
  		<br><br>
  		<strong>seek</strong>: 显示寻找工具提示，以便在点击媒体将指出寻求的地方。
  	</td>
    </tr>
    <tr>
      <td><code>duration</code></td>
      <td>Number</td>
      <td><code>null</code></td>
      <td>指定自定义持续时间。</td>
    </tr>
    <tr>
      <td><code>displayDuration</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>在当前时间显示中显示“metadataloaded”事件（启动时）媒体的持续时间。如果`preload`属性未设置为`none`（或根本不设置），并且您选择不显示持续时间，它将起作用。详见<code>controls</code> 参数).</td>
    </tr>
    <tr>
      <td><code>selectors</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>更多信息参考<code>/src</code>目录下的 <code>plyr.js</code> 文件， 你可能不需要改变这些。</td>
    </tr>
    <tr>
      <td><code>listeners</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>允许事件监听器提前绑定到控件上。 参考上面的<code>controls</code>了解控件列表，更多信息参考<code>/src</code>目录下的<code>plyr.js</code>。</td>
    </tr>
    <tr>
      <td><code>classes</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>和上面相似，这些是当状态更改发生时添加到播放器的类。</td>
    </tr>
    <tr>
      <td><code>captions</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>具有一个属性值<code>defaultActive</code>，如果字幕开启默认切换。 默认值为<code>false</code>。</td>
    </tr>
    <tr>
      <td><code>fullscreen</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>详见 <a href="#fullscreen-options">下面介绍</a></td>
    </tr>
    <tr>
      <td><code>storage</code></td>
      <td>Object</td>
      <td>&mdash;</td>
      <td>两个属性值；<code>enabled</code> 来回切换，如果本地存储应该启用（如果该浏览器支持的话）。默认值为“true”。这使得存储用户的设置，目前它只存储量，但更多的将在以后添加。 第二个属性 <code>key</code> 是用于本地存储的id。默认值为<code>plyr_volume</code>，直到更多的设置被存储。</td>
    </tr>
  </tbody>
</table>

#### 全屏参数

<table class="table" width="100%" id="fullscreen-options">
  <thead>
    <tr>
      <th width="20%">参数</th>
      <th width="15%">类型</th>
      <th width="15%">默认值</th>
      <th width="50%">描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>enabled</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>如果全屏应该启用（如果浏览器支持），则开启。</td>
    </tr>
    <tr>
      <td><code>fallback</code></td>
      <td>Boolean</td>
      <td><code>true</code></td>
      <td>启用旧版浏览器的全屏视图。</td>
    </tr>
    <tr>
      <td><code>allowAudio</code></td>
      <td>Boolean</td>
      <td><code>false</code></td>
      <td>允许音频播放切换全屏。稍后在支持海报时，这将更有用。</td>
    </tr>
  </tbody>
</table>

## API

### 播放器实例

获取plyr播放器实例的最简单方法是存储你调用的`setup()`的返回值：

```javascript
var players = plyr.setup('.js-player');
```

这将返回设置的所有播放器实例的数组。
另一种方法是使用`plyr.get()`方法来获取给定容器中的所有播放器实例，例如：

```javascript
var players = plyr.get('.js-player');
```

如果没有传入参数，它会返回当前document中找到的所有播放器实例。 它会返回在给定选择器中找到的所有播放器实例的数组。

最后一个方法是通过事件处理程序得到播放器实例：

```javascript
instance.on('ready', function(event) {
  var instance = event.detail.plyr;
});
```

### 方法

一旦你得到了播放器实例，你就可以对它使用下面的API方法了。举例来暂停第一个播放器：

```javascript
players[0].pause();
```

以下是当前支持的方法的列表：

<table class="table" width="100%">
<thead>
  <tr>
    <th width="20%">方法</th>
    <th width="15%">参数</th>
    <th width="65%">描述</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><code>getContainer()</code></td>
    <td>&mdash;</td>
    <td>获取脚本自动生成的播放器外层容器元素。</td>
  </tr>
  <tr>
    <td><code>getMedia()</code></td>
    <td>&mdash;</td>
    <td>获取多媒体元素(<code>&gt;video&lt;</code>, <code>&gt;audio&lt;</code> 或者用于 YouTube 和 Vimeo嵌入的 <code>&gt;div&lt;</code> )。</td>
  </tr>
  <tr>
    <td><code>getEmbed()</code></td>
    <td>&mdash;</td>
    <td>获取 [embed](#embed) API 来访问这些方法 - 无论是 YouTube 还是 Vimeo。</td>
  </tr>
  <tr>
    <td><code>getType()</code></td>
    <td>&mdash;</td>
    <td>获取类型 - 'video', 'audio', 'youtube' 或者 'vimeo'。</td>
  </tr>
  <tr>
    <td><code>isReady()</code></td>
    <td>&mdash;</td>
    <td>确定播放器是否已加载并且UI准备就绪。</td>
  </tr>
  <tr>
    <td><code>on()</code></td>
    <td>String, Function</td>
    <td>监听一个事件（第一个参数）并运行一个回调函数（第二个参数）。这样做可以节省你自己使用<code>addEventListner</code>编写代码。这是可链接的。 </td>
  </tr>
  <tr>
    <td><code>play()</code></td>
    <td>&mdash;</td>
    <td>播放多媒体。</td>
  </tr>
  <tr>
    <td><code>pause()</code></td>
    <td>&mdash;</td>
    <td>暂停多媒体播放。</td>
  </tr>
  <tr>
    <td><code>stop()</code></td>
    <td>&mdash;</td>
    <td>停止多媒体播放。</td>
  </tr>
  <tr>
    <td><code>restart()</code></td>
    <td>&mdash;</td>
    <td>重新开始播放</td>
  </tr>
  <tr>
    <td><code>rewind(...)</code></td>
    <td>Number</td>
    <td>通过提供的参数回放，以秒为单位。如果没有提供参数，则使用默认的seekInterval（10秒）。</td>
  </tr>
  <tr>
    <td><code>forward(...)</code></td>
    <td>Number</td>
    <td>通过提供的参数快进，以秒为单位。如果没有提供参数，则使用默认的seekInterval（10秒）。</td>
  </tr>
  <tr>
    <td><code>seek(...)</code></td>
    <td>Number</td>
    <td>根据提供的参数搜索多媒体提供的参数，时间（秒）。</td>
  </tr>
  <tr>
    <td><code>getCurrentTime()</code></td>
    <td>&mdash;</td>
    <td>将以秒为单位返回当前时间的浮点数。</td>
  </tr>
  <tr>
    <td><code>getDuration()</code></td>
    <td>&mdash;</td>
    <td>将以秒为单位返回一个时间段时长浮点数。</td>
  </tr>
  <tr>
    <td><code>getVolume()</code></td>
    <td>&mdash;</td>
    <td>会返回一个0到1之间说明音量程度的浮点数。</td>
  </tr>
  <tr>
    <td><code>isMuted()</code></td>
    <td>&mdash;</td>
    <td>将返回一个布尔值，多媒体当前是否被静音。</td>
  </tr>
  <tr>
    <td><code>setVolume(...)</code></td>
    <td>Number</td>
    <td>用提供的参数设置播放器音量。该值应在0（静音）和10（最大）之间。如果没有提供参数，则使用默认音量（5）。超过10的值将被忽略。</td>
  </tr>
  <tr>
    <td><code>togglePlay()</code></td>
    <td>Boolean</td>
    <td>根据布尔参数或当前状态来切换播放器的播放状态。</td>
  </tr>
  <tr>
    <td><code>isPaused()</code></td>
    <td>&mdash;</td>
    <td>将返回一个布尔值，以确定多媒体当前是否已暂停。</td>
  </tr>
  <tr>
    <td><code>toggleMute()</code></td>
    <td>&mdash;</td>
    <td>为播放器切换静音。</td>
  </tr>
  <tr>
    <td><code>toggleCaptions()</code></td>
    <td>&mdash;</td>
    <td>切换是否启用字幕。</td>
  </tr>
  <tr>
    <td><code>toggleFullscreen()</code></td>
    <td>Event</td>
    <td>切换全屏。由于浏览器安全性，这只能由用户手势启动，即用户事件（如点击）。</td>
  </tr>
  <tr>
    <td><code>isFullscreen()</code></td>
    <td>&mdash;</td>
    <td>播放器是否处于全屏状态</td>
  </tr>
  <tr>
    <td><code>support(...)</code></td>
    <td>String</td>
    <td>确定播放器是否支持某种MIME类型。嵌入式内容（YouTube）不支持此功能。</td>
  </tr>
  <tr>
    <td><code>source(...)</code></td>
    <td>Object or undefined</td>
    <td>
      获取/设置媒体源。
      <br><br>
      <strong>Object</strong><br>
      详见 <a href="#source-method">下文</a>
      <br><br>
      <strong>YouTube</strong><br>
      目前，此API方法仅在与YouTube播放器一起使用时才接受YouTube ID。我将尽快添加URL支持，以及能够在类型之间进行交换（例如YouTube到Audio或Video，反之亦然） 
      <br><br>
      <strong>undefined</strong><br>
      返回当前媒体源URL。适用于本机视频和嵌入。
    </td>
  </tr>
  <tr>
    <td><code>poster(...)</code></td>
    <td>String</td>
    <td>设置海报网址。仅video元素支持该方法。</td>
  </tr>
  <tr>
    <td><code>destroy()</code></td>
    <td>&mdash;</td>
    <td>恢复原始元素，扭转<code>setup()</code>的影响。</td>
  </tr>
 </tbody>
</table>

#### .source() 方法
它允许即时更改plyr媒体源和类型。

视频样本代码：

```javascript
player.source({
  	type:       'video',
  	title:      'Example title',
  	sources: [{
      		src:    '/path/to/movie.mp4',
      		type:   'video/mp4'
  	},
  	{
      		src:    '/path/to/movie.webm',
      		type:   'video/webm'
  	}],
  	poster:     '/path/to/poster.jpg',
  	tracks:     [{
     		kind:   'captions',
      		label:  'English',
      		srclang:'en',
      		src:    '/path/to/captions.vtt',
      		default: true
  	}]
});
```

音频样本代码：

```javascript
player.source({
  	type:       'audio',
  	title:      'Example title',
  	sources: [{
    		src:      '/path/to/audio.mp3',
    		type:     'audio/mp3'
  	},
  	{
    		src:      '/path/to/audio.ogg',
    		type:     'audio/ogg'
  	}]
});
```

YouTube样本代码：

```javascript
player.source({
  	type:       'video',
  	title:      'Example title',
  	sources: [{
      		src:    'bTqVqk7FSmY',
      		type:   'youtube'
  	}]
});
```

注意：`src`可以是视频ID或URL地址

Vimeo 样本代码：

```javascript
player.source({
  	type:       'video',
  	title:      'Example title',
  	sources: [{
      		src:    '143418951',
      		type:   'vimeo'
  	}]
});
```

注意：`src`可以是视频ID或URL地址

有关对象参数的更多细节

<table class="table" width="100%">
  <thead>
    <tr>
      <th width="20%">Key</th>
      <th width="15%">类型</th>
      <th width="65%">描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>type</code></td>
      <td>String</td>
      <td>选项是<code>video</code>, <code>audio</code>, <code>youtube</code> and <code>vimeo</code></td>
    </tr>
    <tr>
      <td><code>title</code></td>
      <td>String</td>
      <td>新的多媒体的标题。用于播放按钮上的“aria-label”属性，也用于外部容器。</td>
    </tr>
    <tr>
      <td><code>sources</code></td>
      <td>Array</td>
      <td>这是一组的多媒体源。当指定数组时<code>type</code>对于YouTube和Vimeo是可选的。对于YouTube和Vimeo多媒体，视频ID或URL地址必须作为如上所示的媒体源传递。该对象的键被直接映射到HTML属性，因此如果需要，可以将更多的属性添加到对象。</td>
    </tr>
    <tr>
      <td><code>poster</code></td>
      <td>String</td>
      <td>封面图片的URL地址（仅限视频）。</td>
    </tr>
    <tr>
      <td><code>tracks</code></td>
      <td>Array</td>
      <td>一组轨道对象。像在上面的示例中一样，队列中的每个元素都直接映射到轨道元素，并将任何键直接映射到HTML属性，它将呈现为`<track kind="captions" label="English" srclang="en" src="https://cdn.selz.com/plyr/1.0/example_captions_en.vtt" default>`。布尔值将转换为HTML5的无价值属性。</td>
    </tr>
  </tbody>
</table>

## 事件
您可以在设置Plyr的目标元素上绑定监听事件（请参见下表中的示例）。某些事件仅适用于HTML5音频和视频。使用你对实例的引用（对象），可以使用`on()` API方法或addEventListener()方法。可以通过`event.detail.plyr`属性来获取实例访问API方法 。以下是一个例子：

```javascript
instance.on('ready', function(event) {
  	var instance = event.detail.plyr;
});
```

这些事件也绑定DOM元素。事件标签可能是容器元素。

<table class="table" width="100%">
  <thead>
    <tr>
      <th width="20%">事件名称</th>
      <th width="20%">仅限HTML5</th>
      <th width="60%">描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>setup</code></td>
      <td></td>
      <td>初始设置完成后触发</td>
    </tr>
    <tr>
      <td><code>ready</code></td>
      <td></td>
      <td>当实例准备好使用API方法和外部API（在YouTube和Vimeo的情况下）准备就绪时触发。</td>
    </tr>
    <tr>
       <td><code>canplay</code></td>
       <td>✔</td>
       <td>当有足够的数据可以播放媒体时，至少有一定帧数时触发。这对应于<code>HAVE_ENOUGH_DATA</code> <code>准备状态r</code>。
       </td>
    </tr>
    <tr>
  	<td><code>canplaythrough</code></td>
  		<td></td>
  		<td>当准备状态改变为<code>CAN_PLAY_THROUGH</code>时触发，表明整个媒体可以播放不间断，假定下载速率至少保持在当前级别。 <strong>注意</strong>：手动设置<code>currentTime</code> 在火狐浏览器中会触发<code>canplaythrough</code>事件。其他浏览器可能不会触发此事件。</td>
     </tr>
  	<tr>
  		<td><code>emptied</code></td>
  		<td>✔</td>
  		<td>多媒体变为空了；举例来说，如果多媒体已经被加载（或部分加载）和使用<code>load()</code>方法重新加载时这个事件会被触发。</td>
  	</tr>
  	<tr>
  		<td><code>ended</code></td>
  		<td></td>
  		<td>播放完成时触发。注意：对于Vimeo，如果`loop`启用了则不会触发此事件。</td>
  	</tr>
  	<tr>
  		<td><code>error</code></td>
  		<td>✔</td>
  		<td>有异常发生时触发事件。&nbsp; element元素的 <code>error</code> 属性包含很多信息。</td>
  	</tr>
  	<tr>
  		<td><code>loadeddata</code></td>
  		<td>✔</td>
  		<td>多媒体的第一帧已经完成加载。</td>
  	</tr>
  	<tr>
  		<td><code>loadedmetadata</code></td>
  		<td>✔</td>
  		<td>媒体的元数据已经完成加载;所有属性像它未来发展趋势一样现在包含尽可能多的有用的信息。</td>
  	</tr>
  	<tr>
  		<td><code>loadstart</code></td>
  		<td>✔</td>
  		<td>当多媒体加载开始时触发。</td>
  	</tr>
  	<tr>
  		<td><code>pause</code></td>
  		<td></td>
  		<td>播放暂停时触发。</td>
  	</tr>
  	<tr>
  		<td><code>play</code></td>
  		<td></td>
  		<td>当多媒体暂停后再开始播放时触发事件；也就是说，当在之前的暂停中恢复播放事件。</td>
  	</tr>
  	<tr>
  		<td><code>playing</code></td>
  		<td></td>
  		<td>媒体开始播放时触发（无论是第一次播放、暂停后再播放还是停止后从新播放 都算）。</td>
  	</tr>
  	<tr>
  		<td><code>progress</code></td>
  		<td></td>
  		<td>定期触发，通知有关方面下载媒体的进度。关于当前已下载的媒体大小的信息可在媒体元素的buffered属性中找到。</td>
  	</tr>
  	<tr>
  		<td><code>seeked</code></td>
  		<td></td>
  		<td>当搜索跳转完成后触发。</td>
  	</tr>
  	<tr>
  		<td><code>seeking</code></td>
  		<td></td>
  		<td>当搜索跳转开始时触发。</td>
  	</tr>
  	<tr>
  		<td><code>stalled</code></td>
  		<td>✔</td>
  		<td>当用户代理尝试获取媒体数据，数据还没有传输时触发。</td>
  	</tr>
  	<tr>
  		<td><code>timeupdate</code></td>
  		<td></td>
  		<td>element元素currentTime属性指示的时间已更改时。</td>
  	</tr>
  	<tr>
  		<td><code>volumechange</code></td>
  		<td></td>
  		<td>当音量发生变化（音量设置和muted属性更改时都会触发）时触发。</td>
  	</tr>
  	<tr>
  		<td><code>waiting</code></td>
  		<td>✔</td>
  		<td>当所请求的操作（如播放）被延迟等待完成另一个操作（如搜索）时触发。</td>
  	</tr>
  	<tr>
  		<td><code>enterfullscreen</code></td>
  		<td></td>
  		<td>用户进入全屏（适用于旧版浏览器的全屏或全窗口回退）时</td>
  	</tr>
  	<tr>
  		<td><code>exitfullscreen</code></td>
  		<td></td>
  		<td>用户退出全屏时</td>
  	</tr>
  	<tr>
  		<td><code>captionsenabled</code></td>
  		<td></td>
  		<td>字幕切换时触发</td>
  	</tr>
  	<tr>
  		<td><code>captionsdisabled</code></td>
  		<td></td>
  		<td>字幕切换完成后触发</td>
  	</tr>
    <tr>
      <td><code>destroyed</code></td>
      <td></td>
      <td>当一个实例被销毁后触发。 替换容器的原始元素将作为事件标签返回到你的处理程序中。</td>
    </tr>
	</tbody>
</table>

细节借阅资料：[https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events)

## 嵌入功能
YouTube和Vimeo目前受支持，功能非常像HTML5视频。检查相关文档部分，了解部分差异。

Plyr引用了一个Vimeo Froogaloop API的自定义版本，因为Vimeo忽略了维护库，并且其版本存在bug。你不必担心包含你自己的Vimeo或YouTube JavaScript API版本。

嵌入第三方API可以通过`getEmbed()`API方法访问。

有关各API的更多信息，请访问：

- [YouTube API Reference](https://developers.google.com/youtube/js_api_reference)
- [Vimeo API Reference](https://developer.vimeo.com/player/js-api#reference)

*请注意*：并不是所有API方法都100％可以运行。你的mileage 可能会改变。最好在可能的情况下使用通用plyr API。

## 快捷键
默认情况下，播放器在聚焦状态下会绑定以下键盘快捷键。如果你有`全局`选项设为true，并且document中只有一个播放器，那么快捷方式在任何element元素处于聚焦状态的情况下都会起作用。

<table class="table" width="100%">
  <thead>
    <tr>
      <th width="25%">快捷键</th>
      <th width="25%">全局</th>
      <th width="50%">行为</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>0</code> to <code>9</code></td>
      <td>✔</td>
      <td>分别寻求跳转到0到90％</td>
    </tr> 
    <tr>
      <td><code>space</code></td>
      <td></td>
      <td>切换播放</td>
    </tr>
    <tr>
      <td><code>K</code></td>
      <td>✔</td>
      <td>切换播放</td>
    </tr>
    <tr>
      <td><code>&larr;</code></td>
      <td></td>
      <td>通过seekTime选项向后搜索</td>
    </tr>
    <tr>
      <td><code>&rarr;</code></td>
      <td></td>
      <td>通过seekTime选项向前搜索</td>
    </tr>
    <tr>
      <td><code>&uarr;</code></td>
      <td></td>
      <td>增大音量</td>
    </tr>
    <tr>
      <td><code>&darr;</code></td>
      <td></td>
      <td>减小音量</td>
    </tr>
    <tr>
      <td><code>M</code></td>
      <td>✔</td>
      <td>切换静音</td>
    </tr>
    <tr>
      <td><code>F</code></td>
      <td>✔</td>
      <td>切换全屏</td>
    </tr>
    <tr>
      <td><code>C</code></td>
      <td>✔</td>
      <td>切换字幕</td>
    </tr>
  </tbody>
</table>

## 流媒体
由于Plyr是标准HTML5视频和音频元素的扩展库，因此第三方流式多媒体插件可与Plyr一起使用。非常感谢Matias Russitto([@russitto](https://github.com/russitto))为此工作。以下是几个例子：

- 使用 [hls.js](https://github.com/dailymotion/hls.js) - [演示](http://codepen.io/sampotts/pen/JKEMqB)
- 使用 [Shaka](https://github.com/google/shaka-player) - [演示](http://codepen.io/sampotts/pen/zBNpVR)
- 使用 [dash.js](https://github.com/Dash-Industry-Forum/dash.js) - [演示](http://codepen.io/sampotts/pen/BzpJXN)

## 全屏
所有[目前支持Plyr](http://caniuse.com/#feat=fullscreen)的浏览器都支持 Plyr中的全屏功能。

## 浏览器支持

<table width="100%" style="text-align: center">
  <thead>
    <tr>
      <td>Safari</td>
      <td>Firefox</td>
      <td>Chrome</td>
      <td>Opera</td>
      <td>IE9</td>
      <td>IE10+</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>✔&sup1;</td>
      <td>✔</td>
      <td>✔</td>
      <td>✔</td>
      <td>API&sup2;</td>
      <td>✔&sup3;</td>
    </tr>
  </tbody>
</table>

&sup1; iPhone上的Mobile Safari对`<video>`强制使用原生播放器，所以无法定制播放器。`<audio>` 元素禁用音量控制。

&sup2; 原生播放器（不支持`<progress>`，并且不支持`<input type="range">`），但支持API（v1.0.28 +）

&sup3; IE10没有原生的全屏支持，可以使用后备(详见[选项](#options))

`enabled` 参数可用于禁用某些用户代理。举例来说，如果你不想将Plyr用于智能手机，你可以使用：
```javascript
enabled: /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
```
如果用户代理被禁用但本地支持`<video>`和`<audio>`，它将使用本地播放器。

如果使用正确的html，任何不受支持的浏览器将显示下载媒体的链接。

### 检查支持
这里有一个 API 方法检查支持。你可以调用`plyr.supported()` 方法并给他传一个类型参数，例如，`plyr.supported("video")`。它会返回一个包含两个键的对象；`basic` 表示对该媒体类型有基本的支持（或者如果没有类型被传递的话），`full`表示完全支持plyr。

## 问题
如果你发现Plyr有什么疑问的，请使用GitHub问题跟踪器告知我们。

## 作者
Plyr 是由[@sam_potts](https://twitter.com/sam_potts) / [sampotts.me](http://sampotts.me) 在各位[贡献者](https://github.com/Selz/plyr/graphs/contributors)的帮助下开发的。

## 捐献
Plyr 是花钱运维的，不算作者的时间（作者是自愿花时间来做这个工作的），可是域名、托管还有其他一些东西都是烧钱的！任何帮助是赞赏。。。
[捐献来支持Plyr](https://www.paypal.me/pottsy/20usd)

## 涉及
- [产品猎人](https://www.producthunt.com/tech/plyr)
- [修改日志](http://thechangelog.com/plyr-simple-html5-media-player-custom-controls-webvtt-captions/)
- [HTML5 周刊 #177](http://html5weekly.com/issues/177)
- [响应式设计 #149](http://us4.campaign-archive2.com/?u=559bc631fe5294fc66f5f7f89&id=451a61490f)
- [网页设计周刊 #174](https://web-design-weekly.com/2015/02/24/web-design-weekly-174/)
- [骇客新闻](https://news.ycombinator.com/item?id=9136774)
- [网页平台日报y](http://webplatformdaily.org/releases/2015-03-04)
- [LayerVault设计师新闻](https://news.layervault.com/stories/45394-plyr--a-simple-html5-media-player)
- [树屋秀 #131](https://teamtreehouse.com/library/episode-131-origami-react-responsive-hero-images)
- [noupe分享平台](http://www.noupe.com/design/html5-plyr-is-a-responsive-and-accessible-video-player-94389.html)

## 使用
- [Selz.com](https://selz.com)
- [Peugeot.fr](http://www.peugeot.fr/marque-et-technologie/technologies/peugeot-i-cockpit.html)
- [Peugeot.de](http://www.peugeot.de/modelle/modellberater/208-3-turer/fotos-videos.html)
- [TomTom.com](http://prioritydriving.tomtom.com/)
- [DIGBMX](http://digbmx.com/)
- [Grime Archive](https://grimearchive.com/)
- [koel - A personal music streaming server that works.](http://koel.phanan.net/)
- [Oscar Radio](http://oscar-radio.xyz/)

让我通过[Twitter](https://twitter.com/sam_potts) 知道怎么把你加紧上述列表中。看看你使用Plyr会有多棒:-)

## 有用的连接和credits
归功于贝宝 HTML5视频播放器，从其中移植了Plyr的字幕功能：
- [贝宝的无障碍HTML5视频播放器](https://github.com/paypal/accessible-html5-video-player)
- 使用的图标是[Vicons](https://dribbble.com/shots/1663443-60-Vicons-Free-Icon-Set) 加上一些自主制作
- [Plyr在日本的指南！](http://syncer.jp/how-to-use-plyr-io) 由 [@arayutw]提供(https://twitter.com/arayutw)

此外，这些链接帮助创建了Plyr：
- [多媒体事件- W3.org](http://www.w3.org/2010/05/video/mediaevents.html)
- [对 `<progress>` 元素进行样式设计 - hongkiat.com](http://www.hongkiat.com/blog/html5-progress-bar/)

## 致谢
[![Fastly](https://www.fastly.com/sites/all/themes/custom/fastly2016/logo.png)](https://www.fastly.com/)

感谢 [Fastly](https://www.fastly.com/) 提供了CDN 服务。

## 版权和许可证
[The MIT license](license.md).
