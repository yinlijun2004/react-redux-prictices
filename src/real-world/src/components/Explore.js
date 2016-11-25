import React, {Component, PropTypes} from 'react'

const GITHUB_REPO = 'https://github.com/reactjs/redux'

export default class Explore extends Component {
    static propTypes = {
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.value !== this.props.value) {
            this.setInputValue(nextProps.value)
        }
    }

    getInputValue() {
        return this.refs.input.value
    }

    setInputValue(val) {
        this.refs.input.value = val
    }

    handleKeyUp(e) {
        if(e.keyCode === 13) {
            this.handleGoClick()
        }
    }

    handleGoClick() {
        this.props.onChange(this.getInputValue())
    }

    render() {
        return  (
            <div>
                <p>Type a username or repo full name and hit 'Go':</p>
                <input size='45' ref='input' defaultValue={this.props.value}
                    onKeyUp={this.handleKeyUp.bind(this)}/>
                <button onClick={this.handleGoClick.bind(this)}>
                    Go!
                </button>
                <p>Code on <a href={GITHUB_REPO} target='_blank'>Github</a></p>
                <p>Move ths DevTools whith Ctrl+W or hide them with Ctrl+H</p>
            </div>
        )
    }
}