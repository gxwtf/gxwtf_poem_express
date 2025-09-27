# 广学古诗文（旧版）——古诗文学习平台

一个基于Node.js和Express的古诗文学习与查询平台，提供古诗文浏览、作者信息查询、断句游戏等功能。

## 项目简介

本项目是一个完整的古诗文学习系统，包含：
- 古诗文数据库（初中版、高中版）
- 作者信息查询系统
- 古诗文断句游戏
- 现代化的Web界面

## 功能特性

### 🎯 核心功能
- **古诗文查询**：支持按标题、作者、朝代、标签搜索
- **作者信息**：详细的诗人传记和作品列表
- **断句游戏**：互动式古诗文断句练习
- **多版本支持**：初中版、高中版古诗文

### 🔧 技术特性
- 基于Express.js的RESTful API
- 响应式Web界面
- 静态文件服务
- 智能路由系统

## 项目结构

```
gxwtf_poem/
├── main.js                 # 主服务器文件
├── package.json            # 项目配置
├── js/                     # 后端路由模块
│   ├── poem.js            # 古诗文路由
│   ├── author.js          # 作者路由
│   ├── breakSentence.js   # 断句游戏路由
│   ├── parsePoem.js       # 古诗文解析工具
│   └── fastRename.js      # 快速重命名工具
├── src/                   # 数据源文件
│   ├── js/               # 古诗文数据
│   └── author/           # 作者数据
├── public/               # 前端静态文件
│   ├── index.html        # 首页
│   ├── viewPoem.html     # 古诗文详情页
│   ├── viewAuthor.html   # 作者详情页
│   ├── game/             # 游戏页面
│   ├── css/              # 样式文件
│   └── js/               # 前端脚本
└── node_modules/         # 依赖包
```

## 快速开始

### 环境要求
- Node.js (推荐最新LTS版本)
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/gxwtf/gxwtf_poem_express.git
cd gxwtf_poem_express
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务器**
```bash
npm start
```

4. **访问应用**
打开浏览器访问：http://localhost:1234

## 使用说明

### 基本操作
- **首页**：浏览古诗文列表和搜索功能
- **古诗文详情**：点击古诗文标题查看完整内容和赏析
- **作者信息**：点击作者姓名查看详细传记
- **断句游戏**：通过游戏菜单进入互动学习

### API接口

#### 古诗文查询
```
GET /古诗文名
GET /poem?search=关键词
GET /poem?title=标题
GET /poem?author=作者
GET /poem?dynasty=朝代
GET /poem?tags=标签1,标签2
GET /poem?version=senior|junior|all
```
#### 作者查询
```
GET /author?name=作者名
GET /author/作者名
```
#### 断句游戏
```
GET /game/breakSentence/古诗文名
```

## 开发指南

### 可用脚本
```bash
npm start          # 启动开发服务器
npm run parse      # 解析古诗文数据
npm run rename     # 快速重命名文件
```

### 数据格式

古诗文数据采用JSON格式：
```javascript
{
    "title": "次北固山下",
    "dynasty": "唐",
    "author": "王湾",
    "tags": [
        "七上",
        "诗",
        "五言律诗"
    ],
    "display": "center",
    "content": [
        {
            "line": "客路青山外，",
            "trans": "旅途延伸在青翠北固山外，",
            "pinyin": "kè lù qīng shān wài"
        },
        {
            "line": "行舟绿水前。",
            "trans": "行船漂浮在碧绿江水之前。",
            "pinyin": "xing zhōu lǜ shuǐ qián"
        },
        {
            "line": "潮平两岸阔，",
            "trans": "潮涨江平两岸更显宽阔，",
            "pinyin": "cháo píng liǎng àn kuò"
        },
        {
            "line": "风正一帆悬。",
            "trans": "顺风吹拂孤帆高高悬垂。",
            "pinyin": "fēng zhèng yī fān xuán"
        },
        {
            "line": "海日生残夜，",
            "trans": "黑夜将尽海上旭日初升，",
            "pinyin": "hǎi rì shēng cán yè"
        },
        {
            "line": "江春入旧年。",
            "trans": "旧年未过江上春意已至。",
            "pinyin": "jiāng chūn rù jiù nián"
        },
        {
            "line": "乡书何处达？",
            "trans": "家书该寄往何处才能到达？",
            "pinyin": "xiāng shū hé chù dá"
        },
        {
            "line": "归雁洛阳边。",
            "trans": "托北归鸿雁捎去洛阳城边。",
            "pinyin": "guī yàn luò yáng biān"
        }
    ],
    "background": "此诗作于唐代先天年间，王湾游历江南途经北固山（今江苏镇江）。当时诗人宦游他乡，行船长江，恰逢冬春交替之时。大唐盛世初显气象，但诗人面对壮丽河山，仍涌起思乡愁绪，遂将旅途见闻化作此千古名篇。",
    "analysis": "本诗最妙在“海日生残夜，江春入旧年”一联。以“生”“入”二字赋予自然现象生命动感，展现新旧交替的哲学意味：残夜未消而红日已升，旧年尚在而春意已临。颈联“潮平岸阔””风正帆悬”以宏阔画卷暗喻人生坦途，尾联则借鸿雁传书回归游子乡愁。全诗气象壮阔而不失细腻，对仗工整如天衣无缝。"
}
```

## 许可证

本项目采用MIT许可证 - 查看LICENSE文件了解详情。

## 联系方式

- 项目主页：https://github.com/gxwtf/gxwtf_poem_express
- Issues：https://github.com/gxwtf/gxwtf_poem_express/issues