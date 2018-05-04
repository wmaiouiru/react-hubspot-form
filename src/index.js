import React from 'react'
import ReactDOM from 'react-dom'

let globalId = 0
let scriptLoaded = false

class HubspotForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: false
		}
		this.id = globalId++
		this.createForm = this.createForm.bind(this)
		this.findFormElement = this.findFormElement.bind(this)
		this.onSubmit = this.onSubmit.bind(this)
	}
	createForm() {
		if (window.hbspt) {
			let props = {
				...this.props
			}
			delete props.loading
			let options = {
				...props,
				target: `#${this.el.getAttribute(`id`)}`,
			}
			window.hbspt.forms.create(options)
			return true
		}
		else{
			setTimeout(this.createForm, 1)
		}
	}
	loadScript() {
		if(scriptLoaded || this.props.noScript) return
		scriptLoaded = true
		let script = document.createElement(`script`)
		script.src = `//js.hsforms.net/forms/v2.js`
		document.head.appendChild(script)
	}
	findFormElement(){
		let form = this.el.querySelector(`form`)
		if(form){
			this.setState({ loaded: true })
			form.addEventListener(`submit`, this.onSubmit)
		}
		else{
			setTimeout(this.findFormElement, 1)
		}
	}
	onSubmit(){
		let interval = setInterval(() => {
			if(!this.el.querySelector(`form`)){
				clearInterval(interval)
				if(this.props.onSubmit){
					this.props.onSubmit()
				}
			}
		}, 1)
	}
	componentDidMount() {
		this.loadScript()
		this.createForm()
		this.findFormElement()
	}
	render() {
		return (
			<div>
				<div
					ref={el => this.el = el}
					id={`reactHubspotForm${this.id}`}
					style={{ display: this.state.loaded ? 'block' : 'none'}}
					/>
				{!this.state.loaded && this.props.loading}
			</div>
		)
	}
}

export default HubspotForm