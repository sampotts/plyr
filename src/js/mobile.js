import { createElement } from './utils/elements';
import { on } from './utils/events';
import is from './utils/is';

class Mobile {
    constructor(player) {
        this.player = player;
        this.SeekSecond= player.config.mobile.seekInterval;

        this.elements = {
            double: {},
        };

        this.IsDouble=false;
        this.LastTouch=0;

        on.call(this.player, this.player.elements.container, 'click', (event) => {
            // Ignore double click in controls
            if (is.element(this.player.elements.controls) && this.player.elements.controls.contains(event.target)) return;

            if(this.LastTouch==0){
                this.LastTouch= new Date().getTime();
            }else{
                if (((new Date().getTime()) - this.LastTouch) < 300) {
                    this.IsDouble=true;
                    this.LastTouch = 0;
                } else {
                    this.LastTouch = new Date().getTime();
                }
            }

            if(this.IsDouble==false) return;

            this.IsDouble=false;

            const clientRect = this.player.elements.container.getBoundingClientRect();
            const percentage = (100 / clientRect.width) * (event.pageX - clientRect.left);
            
            if(percentage<=50) this.rewind();
            else if(percentage >=51) this.forward();
        });

        if(this.player.config.mobile.autoRotateFullscreen && (screen.orientation && screen.orientation.lock)){
            on.call(this.player,this.player.elements.container,'enterfullscreen',(event)=>{
                screen.orientation.lock('landscape');
            })
        }

        this.render();
    }
    animate= (el)=>{
        let Interval= null;
        let Opacity=0;

        el.style.display="block";
        el.style.opacity=Opacity;

        const Show = (cb)=>{
            Interval= setInterval(()=>{
                Opacity+=0.1;
                console.log(Opacity);
                el.style.opacity= Opacity;
    
                if(Opacity>=1){
                    clearInterval(Interval);
                    cb()
                }
            }, 30);
        }
        const Hide = ()=>{
            Interval= setInterval(()=>{
                Opacity-=0.1;
                console.log(Opacity);
                el.style.opacity= Opacity;
    
                if(Opacity<=0){
                    clearInterval(Interval);
                }
            }, 25);
        }
        
        Show(Hide);
        
    }
    forward= () =>{
        this.animate(this.elements.double.right);
        this.player.forward(this.SeekSecond);
    }

    rewind= ()=>{
        this.animate(this.elements.double.left);
        this.player.rewind(this.SeekSecond);
    }

    render=()=>{
        this.elements.double.container = createElement('div', {
            class: "double-container",
        });

        this.elements.double.left = createElement('div', {
            class: "double-left",
        });

        this.elements.double.right = createElement('div', {
            class: "double-right",
        });

        this.elements.double.container.appendChild(this.elements.double.left);
        this.elements.double.container.appendChild(this.elements.double.right);

        this.player.elements.wrapper.appendChild(this.elements.double.container);
    }


}

export default Mobile;
