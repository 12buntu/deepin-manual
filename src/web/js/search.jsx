import React, { Component } from "react"
import PropTypes from "prop-types"
import { Scrollbars } from "react-custom-scrollbars"

class Items extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title: "",
			logo: "",
			show: false
		}
		let path = props.file.slice(0, props.file.lastIndexOf("/") + 1)
		global.readFile(props.file, data => {
			let [title, logo] = data
				.substr("# ".length, data.indexOf("\n"))
				.split("|")
			logo = `${path}${logo}`
			this.setState({ title, logo, show: true })
		})
	}
	render() {
		let resultList = []
		for (let i = 0; i < this.props.keys.length; i++) {
			resultList.push(
				<div
					className="item"
					key={i}
					onClick={() => global.openFile(this.props.file, this.props.keys[i])}
				>
					<div className="title">{this.props.keys[i]}</div>
					{this.props.values[i]}
				</div>
			)
		}
		return (
			this.state.show && (
				<div className="items">
					<div
						className="title"
						onClick={() => global.openFile(this.props.file)}
					>
						<img src={this.state.logo} />
						<span>{this.state.title}</span>
					</div>
					{resultList}
				</div>
			)
		)
	}
}
function Mismatch(props) {
	return (
		<div id="mismatch">
			<div>
				<div id="NoResult">
					{global.i18n["NoResult"].replace("%1", props.keyword)}
				</div>
				<div id="WikiSearch">{global.i18n["WikiSearch"]}</div>
				<span id="button">百科搜索</span>
			</div>
		</div>
	)
}
export default class SearchPage extends Component {
	constructor(props, context) {
		super(props, context)
	}
	render() {
		let c = null
		if (this.context.mismatch) {
			c = <Mismatch keyword={this.props.match.params.keyword} />
		} else {
			c = this.context.searchResult.map(result => (
				<Items
					key={result.file}
					file={result.file}
					keys={result.keys}
					values={result.values}
				/>
			))
		}
		return (
			<Scrollbars>
				<div id="search">{c}</div>
			</Scrollbars>
		)
	}
}

SearchPage.contextTypes = {
	searchResult: PropTypes.array,
	mismatch: PropTypes.bool
}
