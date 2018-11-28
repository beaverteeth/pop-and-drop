import React from 'react'

import './component.css'

export default class PopAndDrop extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            measured: false,
            left: 0,
            top: 0
        }

        this.resizeEv = false
        this.resizeTo = null
    }

    componentDidMount() {
        // give div a moment to calculate it's positions before
        // modifying
        setImmediate(this.calculate)
    }

    componentWillUnmount() {

        // remove resize listener on 'window'
        if (this.resizeEv) {
            window.removeEventListener('resize', this.onResize.bind(this))
            this.resizeEv = false
        }

        // remove delayed resize calculation timer pump if exists
        if (this.resizeTo) {
            clearTimeout(this.resizeTo)
            this.resizeTo = null
        }

    }

    static getDerivedStateFromProps(nextProps, prevState){
        return({
            visible: nextProps.visible
        })
    }

    updateListeners = () => {

        if (!this.resizeEv && this.state.visible && !this.resizeEv) {
            window.addEventListener('resize', this.onResize.bind(this))
            this.resizeEv = true
        } else if (this.resizeEv && !this.state.visible && this.resizeEv) {
            window.removeEventListener('resize', this.onResize.bind(this))
            this.resizeEv = false
        }
    }

    componentDidUpdate() {
        this.updateListeners()
    }

    onResize = () => {

        if (this.resizeTo)
            clearTimeout(this.resizeTo)

        this.resizeTo = setTimeout( () => {
            this.calculate()
            this.resizeTo = null
        }, 100)
    }

    onClose = (ev) => {

        if (this.props.onClose)
            this.props.onClose(ev)

        ev.stopPropagation()
        ev.nativeEvent.stopImmediatePropagation()
        return false
    }

    calculate = () => {

        const pageWidth = window.innerWidth
        const pageHeight = window.innerHeight

        let {left, bottom: top, width: relWidth} = this.props.relativeTo.current.getBoundingClientRect()

        let tick = left
        let tickCenter = left + Math.floor(relWidth / 2)

        let width = this.props.width || 100
        let height = this.props.height || 100
        let topMargin = this.props.topMargin || 0
        let leftMargin = this.props.leftMargin || 0
        let rightMargin = this.props.rightMargin || 0
        let bottomMargin = this.props.bottomMargin || 0

        top += topMargin

        if (this.props.width) {
        
            if (this.props.width != 'full') {

                if (left + width + rightMargin > pageWidth)
                    left = pageWidth - this.props.width - rightMargin

            } else {
                
                left = leftMargin
                width = pageWidth - leftMargin - rightMargin
            }

        }

        if (this.props.height) {

            if (this.props.height == 'full') {
                height = pageHeight - top - bottomMargin
            }

            if (top + height + bottomMargin > pageHeight)
                height = pageHeight - top - bottomMargin

        }

        tick -= left
        tickCenter -= left

        this.setState({
            left, top, width, height, tick, tickCenter, pageWidth, pageHeight,
            measured: true
        })

        this.updateListeners()

    }

    renderModal = () => {

        return (
            <div
                className="pop-and-drop-modal"
                style={{
                    backgroundColor: this.props.onModalTint || 'transparent',
                }}
                onClick={this.onClose}
            >
            </div>
        )

    }


    render() {

        if (!this.state.measured || !this.state.visible)
            return null

        return (
            <div className="pop-and-drop-container" style={{
                top: this.state.top,
                left: this.state.left,
                width: this.state.width,
                height: this.state.height,
                maxHeight: this.state.height,
                maxWidth: this.state.width
            }}>
                {this.props.modal ? this.renderModal() : false}
                {this.props.tick ? this.props.tick(this.state.tick, this.state.tickCenter) : null}
                <div style={{position: 'absolute', display: 'block', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3}}>
                    {this.props.children}
                </div>
            </div>
        )

    }

}