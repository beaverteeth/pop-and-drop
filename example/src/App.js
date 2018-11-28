import React, {Component} from 'react'
import PopAndDrop from 'pop-and-drop'

import './example.css'

export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isShowing1: false,
      isShowing2: false
    }

    this.buttonRelativeRef1 = React.createRef()
    this.buttonRelativeRef2 = React.createRef()
  }

  // Optional callbacks to put a nice tails on our Pop-And-Drop boxes
  //    tick = left side of relativeTo component
  //    tickcenter = center of relativeTo component
  //    Note: check z-order in the example.css

  upTick1 = (tick, tickCenter) => {
    return (
        <div 
          className="pop-and-drop-example-tick-1"
          style={{
              left: tickCenter - 5,
          }}>
        </div>
    )
  }

  upTick2 = (tick, tickCenter) => {
    return (
        <div 
          className="pop-and-drop-example-tick-2"
          style={{
              left: tick + 24,
          }}>
        </div>
    )
  }

  render () {
    return (
      <div className="pop-and-drop-example">

        <div 
            ref={this.buttonRelativeRef1} 
            className="pop-and-drop-example-button"
            onClick={()=>{
              this.setState({isShowing1: true})
            }}>
            Click Me 1
        </div>
        <div 
            ref={this.buttonRelativeRef2} 
            className="pop-and-drop-example-button"
            onClick={()=>{
              this.setState({isShowing2: true})
            }}>
            Click Me 2
        </div>

        {/* 
        These are our popups. The PopAndDrop can contain any div, it is recommended 
        the inner div has a 100% width and height. 

        - The first PopAndDrop is full height and width with margin set backs.
        - The second PopAndDrop is fixed width and height and will try to avoid the
          right edge of the screen on resize by the right margin amount to avoid
          popping up offscreen.
        - the "tick" property points to a function that returns your tick rendering code
         */}
        <PopAndDrop 
          relativeTo={this.buttonRelativeRef1} 
          visible={this.state.isShowing1} 
          tick={this.upTick1}
          modal={true}
          width="full"
          height="full"
          topMargin={13}
          leftMargin={40}
          rightMargin={40}
          bottomMargin={40}
          onClose={()=>{
            this.setState({isShowing1: false})
          }}
          onModalTint="rgba(0,0,0,0.25)">
          <div className="pop-and-drop-example-hello-1">    
            Hello #1
          </div>          
        </PopAndDrop>

        <PopAndDrop 
          relativeTo={this.buttonRelativeRef2} 
          visible={this.state.isShowing2} 
          tick={this.upTick2}
          modal={true}
          topMargin={28}
          leftMargin={20}
          rightMargin={40}
          width={400}
          height={200}
          onClose={()=>{
            this.setState({isShowing2: false})
          }}
          onModalTint="rgba(0,100,60,0.25)">
          <div className="pop-and-drop-example-hello-2">    
            Hello #2
          </div>          
        </PopAndDrop>
      </div>
    )
  }
}
