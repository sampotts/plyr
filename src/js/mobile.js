import { createElement } from './utils/elements';
import { on } from './utils/events';
import is from './utils/is';
import { clamp } from './utils/numbers'
import { formatTime,getHours } from './utils/time';

class Mobile {
    constructor(player) {
        this.player = player;
        this.SeekSecond= player.config.mobile.seekInterval;

        this.elements = {
            double: {},
        };

        this.IsDouble=false;
        this.LastTouch=0;

        this.isDragging=false;
        this.startX=0;
        this.currentTime=0;

        on.call(this.player,this.player.elements.container,'touchstart',(event)=>{
            if (event.touches.length === 1) {
                this.isDragging = true;
                this.startX = event.touches[0].clientX;
            }
        })

        on.call(this.player,this.player.elements.container,'touchmove',(event)=>{
            if (event.touches.length === 1 && this.isDragging) {

                if(this.player.playing) this.player.pause();

                const widthDiff = event.touches[0].clientX - this.startX;
                const proportion = clamp(widthDiff / this.player.elements.container.clientWidth, -1, 1);
                this.currentTime = clamp(this.player.currentTime+this.player.duration*proportion,0,this.player.duration);

                const forceHours = getHours(this.player.duration) > 0
                const Time= formatTime(this.currentTime,forceHours,false);
                this.player.elements.display.currentTime.innerHTML=Time;

                this.player.previewThumbnails.showTime(event,this.currentTime);
            }
        })

        on.call(this.player,this.player.elements.container,'touchend',(event)=>{
            this.player.previewThumbnails.endScrubbing();

            if(this.isDragging && this.currentTime){
                this.player.currentTime= this.currentTime;
                this.player.play();
            }
            this.isDragging=false;
            this.startX=0;
            this.currentTime=0;
        })


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
        
        if(this.player.config.mobile.hideVolume){
            this.player.config.controls= this.player.config.controls.filter(x=>x!="volume");
        }

        this.render();

        this.player.on("ready",()=>this.removeItems());
    }

    animate = (el)=>{
        if(el.className.includes(this.player.config.classNames.mobile.isShown)==false){
            var mainName=el.className;
            el.classList.toggle(mainName+this.player.config.classNames.mobile.isShown, true);

            setTimeout(() => {
                el.classList.toggle(mainName+this.player.config.classNames.mobile.isShown, false);
            }, 300);
        }
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
            class: this.player.config.classNames.mobile.doubleContainer,
        });

        this.elements.double.left = createElement('div', {
            class: this.player.config.classNames.mobile.left,
        });
        this.elements.double.left.innerHTML="- "+this.SeekSecond;

        this.elements.double.right = createElement('div', {
            class: this.player.config.classNames.mobile.right,
        });
        this.elements.double.right.innerHTML="+ "+this.SeekSecond;

        this.elements.double.container.appendChild(this.elements.double.left);
        this.elements.double.container.appendChild(this.elements.double.right);

        this.player.elements.wrapper.appendChild(this.elements.double.container);
    }

    removeItems = () =>{
        if(this.player.config.mobile.hideVolume) this.player.elements.volume.hidden=true;
    }
}

export default Mobile;
