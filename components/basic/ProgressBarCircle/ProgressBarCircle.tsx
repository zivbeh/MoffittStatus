"use client"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { easeQuadInOut } from 'd3-ease';
import AnimatedProgressProvider from './animatedprogressprovider.js'
interface ProgressBarCircleProps {
    circleMax:number;
    duration:number;
  }
export default function ProgressBarCircle({circleMax, duration}:ProgressBarCircleProps) {
    return (
        <AnimatedProgressProvider
                valueStart={0}
                valueEnd={circleMax}
                duration={duration}
                easingFunction={easeQuadInOut}
                style={{fontWeight:'bold'}}>
                {(value:number) => {
                    const roundedValue = Math.round(value);
                    return (
                        <div style={{fontWeight:'bold'}}>
                    <CircularProgressbar
                        value={value}
                        text={`${roundedValue}%`}
                        className="w-20 h-20"
                        background
                        backgroundPadding={0}
                        /* This is important to include, because if you're fully managing the
                        animation yourself, you'll want to disable the CSS animation. */
                        styles={buildStyles({ pathTransition: 'none', backgroundColor: "#a3dfff",textSize:"24px"})}
                    />
                    </div>
                    );
                }}
                </AnimatedProgressProvider>
    )
}

