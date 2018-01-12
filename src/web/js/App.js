import React from "react"
import PropTypes from "prop-types"
import { render } from "react-dom"
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom"

import Index from "./index.jsx"
import Main from "./main.jsx"
import Search from "./search.jsx"
import sIndex from "./searchIndex"

global.lang = navigator.language.replace("-", "_")
global.path = getSystemManualDir("")

global.readFile = (fileName, callback) => {
	let xhr = new XMLHttpRequest()
	xhr.open("GET", fileName)
	xhr.onload = () => {
		if (xhr.responseText != "") {
			callback(xhr.responseText)
		}
	}
	xhr.send()
}

class Test extends React.Component {
	constructor(props) {
		super(props)
		console.log(props)
	}
	render() {
		let m = Math.random()
		let file = decodeURIComponent(this.props.match.params.file)
		return (
			<div>
				{file}
				<Link to={"/open/" + m}>{m}</Link>
			</div>
		)
	}
}

class App extends React.Component {
	constructor(props, context) {
		super(props, context)
		global.index = () => {
			this.context.router.history.push("/index")
		}
		global.openApp = (appName, hash) => {
			let file = `${global.path}/${appName}/${global.lang}/index.md`
			global.openFile(file, hash)
		}
		global.openFile = (file, hash) => {
			let url = `/open/${encodeURIComponent(file)}`
			if (hash != null) {
				url += `/${encodeURIComponent(hash)}`
			}
			this.context.router.history.push(url)
		}
		global.openSearchPage = keyword => {
			this.context.router.history.push("/search/" + encodeURIComponent(keyword))
		}
		global.back = () => {
			this.context.router.history.goBack()
		}
		new QWebChannel(qt.webChannelTransport, channel => {
			channel.objects.i18n.getSentences(i18n => {
				global.i18n = i18n
				global.qtObjects = channel.objects
				this.setState({ init: true })

				global.qtObjects.titleBar.setBackButtonVisible(true)
				global.qtObjects.titleBar.backButtonClicked.connect(() =>
					this.context.router.history.goBack()
				)
				global.readFile(global.path, data => {
					let appList = data.match(/addRow\("([^.][^"]+)"/g).map(r => {
						return r.match(/"([^"]+)"/)[1]
					})
					appList.map(appName => {
						const file = `${global.path}/${appName}/${global.lang}/index.md`
						global.readFile(file, data => sIndex(file, data))
					})
				})
			})
		})
		this.state = {
			init: false
		}
	}
	componentWillReceiveProps(props) {
		console.log(props)
	}
	render() {
		console.log(this.state)
		return (
			<div>
				{this.state.init && (
					<Switch>
						<Route path="/index" component={Index} />
						<Route path="/open/:file/:hash?" component={Main} />
						<Route path="/search/:keyword" component={Search} />
					</Switch>
				)}
			</div>
		)
	}
}
App.contextTypes = {
	router: PropTypes.object
}

render(
	<Router>
		<App />
	</Router>,
	document.getElementById("app")
)
// global.index = () => {}
// global.openApp = () => {}
// global.openFile = () => {}

// import Index from "./index.jsx"
// import Main from "./main.jsx"
// import Search from "./search.jsx"

// import m2h from "./mdToHtml"
// import sIndex from "./searchIndex"

// class App extends Component {
// 	constructor(props) {
// 		super(props)
// 		let { searchWord = "", appName = "" } = props
// 		this.state = { searchWord, appName, searchResult: [] }

// 		global.qtObjects.titleBar.backButtonClicked.connect(
// 			this.backButtonClicked.bind(this)
// 		)
// 		global.qtObjects.search.mismatch.connect(() =>
// 			this.setState({ searchResult: null })
// 		)
// 		global.qtObjects.search.onContentResult.connect(
// 			this.onContentResult.bind(this)
// 		)
// 	}
// 	componentWillReceiveProps(nextProps) {
// 		let { searchWord = "", appName = "" } = nextProps
// 		this.setState({ searchWord, appName, searchResult: [] })
// 	}
// 	backButtonClicked() {
// 		let { searchWord, appName } = this.state
// 		if (searchWord != "") {
// 			searchWord = ""
// 		} else if (appName != "") {
// 			appName = ""
// 		}
// 		this.setState({ searchWord, appName })
// 	}
// 	onContentResult(file, keys, values) {
// 		console.log("searchResult", this.state, file, keys, values)
// 		let searchResult = this.state.searchResult
// 		searchResult.push({ file, keys, values })
// 		this.setState({ searchResult })
// 	}
// 	render() {
// 		console.log(this.state)
// 		let c = null
// 		switch (true) {
// 			case this.state.searchWord != "":
// 				c = (
// 					<Search
// 						kw={this.state.searchWord}
// 						searchResult={this.state.searchResult}
// 					/>
// 				)
// 				global.qtObjects.titleBar.setBackButtonVisible(true)
// 				break
// 			case this.state.appName != "":
// 				c = (
// 					<Main
// 						file={this.state.appName}
// 						hlist={this.props.appData.hlist}
// 						hash={this.props.appData.hash}
// 						html={this.props.appData.html}
// 					/>
// 				)
// 				global.qtObjects.titleBar.setBackButtonVisible(true)
// 				global.qtObjects.search.setCurrentApp(this.state.file)
// 				break
// 			default:
// 				c = <Index />
// 				global.qtObjects.titleBar.setBackButtonVisible(false)
// 				global.qtObjects.search.setCurrentApp("")
// 		}
// 		console.log(c)
// 		return c
// 	}
// }

// global.lang = navigator.language.replace("-", "_")
// global.path = getSystemManualDir("")
// global.readFile = (fileName, callback) => {
// 	let xhr = new XMLHttpRequest()
// 	xhr.open("GET", fileName)
// 	xhr.onload = () => {
// 		if (xhr.responseText != "") {
// 			callback(xhr.responseText)
// 		}
// 	}
// 	xhr.send()
// }
// global.openSearchPage = keyword => {
// 	ReactDOM.render(<App searchWord={keyword} />, document.body)
// }
// global.qtObjects = null
// let delay = null

// global.openFile = (file, hash) => {
// 	console.log("Open", file, hash)
// 	if (global.qtObjects == null) {
// 		delay = () => global.openFile(file)
// 		return
// 	}
// 	// global.readFile(file, data => {
// 	// 	let { html, hlist } = m2h(file, data)
// 	// 	ReactDOM.render(
// 	// 		<App appName={file} appData={{ hlist, html, hash }} />,
// 	// 		document.body
// 	// 	)
// 	// 	sIndex(file, null, html)
// 	// })
// }
// global.openApp = appName => {
// 	if (global.qtObjects == null) {
// 		delay = () => global.openApp(appName)
// 		return
// 	}
// 	let file = `${global.path}/${appName}/${global.lang}/index.md`
// 	global.openFile(file)
// }

// global.index = () => {
// 	if (global.qtObjects == null) {
// 		delay = () => global.index()
// 		return
// 	}
// 	// ReactDOM.render(<App />, document.body)
// }

// function searchIndexCheck() {
// 	global.readFile(global.path, data => {
// 		let appList = data.match(/addRow\("([^.][^"]+)"/g).map(r => {
// 			return r.match(/"([^"]+)"/)[1]
// 		})
// 		appList.map(appName => {
// 			const file = `${global.path}/${appName}/${global.lang}/index.md`
// 			global.readFile(file, data => sIndex(file, data))
// 		})
// 	})
// }
// function qtInit(channel) {
// 	channel.objects.i18n.getSentences(i18n => {
// 		global.i18n = i18n
// 		global.qtObjects = channel.objects
// 		if (delay != null) {
// 			delay()
// 		}
// 	})
// 	searchIndexCheck()
// 	console.log(global.qtObjects)
// }
// new QWebChannel(qt.webChannelTransport, qtInit)
