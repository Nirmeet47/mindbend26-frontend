'use client';
import React, { useEffect, useState } from 'react';

const colors = {
    white: '#ffffff',
    blue: '#1a5a63',
    green: '#0e2829',
    red: '#5a1218',
    orange: '#7a441f',
};

// Keyframe animations as style tag content
const keyframeStyles = `
@import url('https://fonts.googleapis.com/css?family=Orbitron');

@keyframes speed {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg); }
}

@keyframes progress {
    0% { stroke-dasharray: 0 100; }
}

@keyframes changeColor {
    0% { background: ${colors.blue}; box-shadow: 1px 1px 10px ${colors.blue}; }
    25% { border-radius: 50%; }
    50% { background: ${colors.orange}; box-shadow: 1px 1px 10px ${colors.orange}; }
    100% { background: ${colors.red}; box-shadow: 1px 1px 10px ${colors.red}; }
}

@keyframes rotate-c2 {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(90deg); }
    30% { transform: rotate(180deg); }
    60% { transform: rotate(3000deg); }
    80% { transform: rotate(-40deg); }
    100% { transform: rotate(0deg); }
}

@keyframes rotate-c4 {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(20deg); }
    30% { transform: rotate(50deg); }
    60% { transform: rotate(90deg); }
    80% { transform: rotate(-40deg); }
    100% { transform: rotate(0deg); }
}

@keyframes rotate-c5 {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(-90deg); }
    30% { transform: rotate(40deg); }
    50% { transform: rotate(120deg); }
    60% { transform: rotate(90deg); }
    90% { transform: rotate(300deg); }
    100% { transform: rotate(0deg); }
}

@keyframes rotate-c6 {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(70deg); }
    30% { transform: rotate(40deg); }
    50% { transform: rotate(20deg); }
    60% { transform: rotate(100deg); }
    90% { transform: rotate(180deg); }
    100% { transform: rotate(0deg); }
}

@keyframes rotate-c7 {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(80deg); }
    30% { transform: rotate(50deg); }
    60% { transform: rotate(80deg); }
    80% { transform: rotate(150deg); }
    100% { transform: rotate(0deg); }
}

@keyframes rotate-c8 {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(40deg); }
    30% { transform: rotate(80deg); }
    60% { transform: rotate(-60deg); }
    80% { transform: rotate(100deg); }
    100% { transform: rotate(0deg); }
}

@keyframes rotate-c9 {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(20deg); }
    30% { transform: rotate(40deg); }
    50% { transform: rotate(10deg); }
    60% { transform: rotate(120deg); }
    90% { transform: rotate(70deg); }
    100% { transform: rotate(0deg); }
}

@keyframes rotate-c10 {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(70deg); }
    30% { transform: rotate(-40deg); }
    50% { transform: rotate(20deg); }
    60% { transform: rotate(100deg); }
    90% { transform: rotate(180deg); }
    100% { transform: rotate(0deg); }
}

@keyframes rotate-c11 {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(80deg); }
    30% { transform: rotate(50deg); }
    60% { transform: rotate(80deg); }
    80% { transform: rotate(150deg); }
    100% { transform: rotate(0deg); }
}
`;

// Square transforms
const squareTransforms = [
    'rotate(0deg) translateY(-90px) skewX(-50deg)',
    'rotate(20deg) translateY(-90px) skewX(-50deg)',
    'rotate(40deg) translateY(-90px) skewX(-50deg)',
    'rotate(60deg) translateY(-90px) skewX(-50deg)',
    'rotate(80deg) translateY(-90px) skewX(-50deg)',
    'rotate(100deg) translateY(-90px) skewX(-50deg)',
    'rotate(120deg) translateY(-90px) skewX(-50deg)',
    'rotate(140deg) translateY(-90px) skewX(-50deg)',
    'rotate(160deg) translateY(-90px) skewX(-50deg)',
    'rotate(180deg) translateY(-90px) skewX(-50deg)',
    'rotate(200deg) translateY(-90px) skewX(-50deg)',
    'rotate(220deg) translateY(-90px) skewX(-50deg)',
    'rotate(240deg) translateY(-90px) skewX(-50deg)',
    'rotate(260deg) translateY(-90px) skewX(-50deg)',
    'rotate(280deg) translateY(-90px) skewX(-50deg)',
    'rotate(300deg) translateY(-90px) skewX(-50deg)',
    'rotate(320deg) translateY(-90px) skewX(-50deg)',
    'rotate(340deg) translateY(-90px) skewX(-50deg)',
];

// Rectangle transforms
const rectangleTransforms = [
    'rotate(15deg) translateY(-140px)',
    'rotate(30deg) translateY(-140px)',
    'rotate(45deg) translateY(-140px)',
    'rotate(60deg) translateY(-140px)',
    'rotate(75deg) translateY(-140px)',
    'rotate(90deg) translateY(-140px)',
    'rotate(105deg) translateY(-140px)',
    'rotate(120deg) translateY(-140px)',
    'rotate(135deg) translateY(-140px)',
    'rotate(150deg) translateY(-140px)',
    'rotate(165deg) translateY(-140px)',
    'rotate(180deg) translateY(-140px)',
    'rotate(195deg) translateY(-140px)',
    'rotate(210deg) translateY(-140px)',
    'rotate(225deg) translateY(-140px)',
    'rotate(240deg) translateY(-140px)',
    'rotate(255deg) translateY(-140px)',
    'rotate(270deg) translateY(-140px)',
    'rotate(285deg) translateY(-140px)',
    'rotate(300deg) translateY(-140px)',
    'rotate(315deg) translateY(-140px)',
    'rotate(330deg) translateY(-140px)',
    'rotate(345deg) translateY(-140px)',
];

// Symbol transforms
const symbolTransforms = [
    'rotate(0deg) translateY(-200px)',
    'rotate(45deg) translateY(-200px) rotate(-45deg)',
    'rotate(315deg) translateY(-200px) rotate(-315deg)',
    'rotate(135deg) translateY(-200px) rotate(-135deg)',
    'rotate(180deg) translateY(-200px) rotate(-180deg)',
    'rotate(225deg) translateY(-200px) rotate(-225deg)',
];

const TechnicalBackground = () => {
    const [is3D, setIs3D] = useState(false);
    const [isBoost, setIsBoost] = useState(false);
    const [isInspect, setIsInspect] = useState(false);
    const [cpuPercent, setCpuPercent] = useState(0);
    const [symbolValues, setSymbolValues] = useState<string[]>(Array(6).fill('0'));

    useEffect(() => {
        let percent = 0;
        const intervalId = setInterval(() => {
            // Update Symbols
            const newSymbols = Array(6).fill(0).map(() => Math.floor(Math.random() * 2).toString());
            setSymbolValues(newSymbols);

            // Update CPU
            percent++;
            if (percent >= 100) {
                setCpuPercent(100);
            } else {
                setCpuPercent(percent);
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        let timeouts: ReturnType<typeof setTimeout>[] = [];

        const runSequence = () => {
            const t1 = setTimeout(() => setIs3D(true), 500);
            const t2 = setTimeout(() => setIsBoost(true), 2500);
            const t3 = setTimeout(() => setIsInspect(true), 4500);
            // const t4 = setTimeout(() => {
            //     setIs3D(false);
            //     setIsBoost(false);
            //     setIsInspect(false);
            // }, 10000);

            timeouts = [t1, t2, t3];
        };

        runSequence();
        const intervalId = setInterval(runSequence, 15000);

        // return () => {
        //     clearInterval(intervalId);
        //     timeouts.forEach(clearTimeout);
        // };
    }, []);

    // Circle styles
    const circleBaseStyle: React.CSSProperties = {
        fill: 'none',
        strokeLinecap: 'round',
        transformOrigin: '50% 50%',
        willChange: 'transform',
        stroke: colors.blue,
    };

    return (
        <>
            {/* Inject keyframe animations */}
            <style>{keyframeStyles}</style>

            {/* BACKGROUND LAYER - VISUALS ONLY */}
            <div
                className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden m-0"
                style={{ background: 'black', fontFamily: "'Orbitron', sans-serif" }}
            >
                <div 
                    className="flex flex-col justify-center items-center select-none w-full h-full"
                    style={{ opacity: 0.8 }} // Added opacity to dim the entire animation
                >
                    <div className="flex flex-col justify-center items-center select-none w-full h-full">
                        <div
                            className="flex justify-center items-center absolute"
                            style={{
                                width: '80vw',
                                height: '80vh',
                                top: 'calc(50% - 40vh)',
                                left: 'calc(50% - 40vw)',
                                transition: 'all 5s ease',
                                transform: is3D
                                    ? (isInspect ? 'perspective(200px) rotateX(70deg) rotate(360deg)' : 'rotateX(10deg) rotateY(40deg) translateY(40px) translateX(-120px)')
                                    : (isInspect ? 'perspective(200px) rotateX(70deg) rotate(360deg)' : 'rotateX(0deg)'),
                                willChange: 'transform',
                                perspective: '800px',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* SVG RING */}
                            <svg
                                className="w-full h-full z-[1]"
                                viewBox="0 0 100 100"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="50" cy="50" r="4" style={{ ...circleBaseStyle, strokeWidth: 0.1 }} />
                                <circle cx="50" cy="50" r="5" style={{ ...circleBaseStyle, strokeWidth: 0.1, strokeDasharray: '5, 10', animation: 'rotate-c2 10s infinite cubic-bezier(0.645, 0.045, 0.355, 1)' }} />
                                <circle cx="50" cy="50" r="7" style={{ ...circleBaseStyle, strokeWidth: 1, transform: 'rotate(-90deg)', animation: 'progress 10s ease-out forwards', stroke: colors.red, strokeDasharray: '38, 100' }} />
                                <circle cx="50" cy="50" r="8.5" style={{ ...circleBaseStyle, strokeWidth: 1, transform: 'rotate(-90deg)', animation: 'progress 10s ease-out forwards', strokeDasharray: '46, 100' }} />
                                <circle cx="50" cy="50" r="10" style={{ ...circleBaseStyle, strokeWidth: 1, transform: 'rotate(-90deg)', animation: 'progress 10s ease-out forwards', strokeDasharray: '54, 100' }} />
                                <circle cx="50" cy="50" r="27" style={{ ...circleBaseStyle, strokeWidth: 0.5, animation: 'rotate-c4 10s infinite cubic-bezier(0.645, 0.045, 0.355, 1)' }} />
                                <circle cx="50" cy="50" r="28" style={{ ...circleBaseStyle, strokeWidth: 0.7, strokeDasharray: '40', animation: 'rotate-c5 10s infinite cubic-bezier(0.645, 0.045, 0.355, 1)' }} />
                                <circle cx="50" cy="50" r="29" style={{ ...circleBaseStyle, strokeWidth: 0.7, strokeDasharray: '10', animation: 'rotate-c6 10s infinite cubic-bezier(0.645, 0.045, 0.355, 1)' }} />
                                <circle cx="50" cy="50" r="43" style={{ ...circleBaseStyle, strokeWidth: 0.7, strokeDasharray: '0.3', animation: 'rotate-c7 10s infinite cubic-bezier(0.645, 0.045, 0.355, 1)' }} />
                                <circle cx="50" cy="50" r="45" style={{ ...circleBaseStyle, strokeWidth: 2, strokeDasharray: '30, 100', animation: 'rotate-c8 10s infinite cubic-bezier(0.645, 0.045, 0.355, 1)' }} />
                                <circle cx="50" cy="50" r="46" style={{ ...circleBaseStyle, strokeWidth: 0.4, strokeDasharray: '20', animation: 'rotate-c9 10s infinite cubic-bezier(0.645, 0.045, 0.355, 1)' }} />
                                <circle cx="50" cy="50" r="48" style={{ ...circleBaseStyle, strokeWidth: 0.4, strokeDasharray: '80, 100', animation: 'rotate-c10 10s infinite cubic-bezier(0.645, 0.045, 0.355, 1)' }} />
                                <circle cx="50" cy="50" r="49" style={{ ...circleBaseStyle, strokeWidth: 1, strokeDasharray: '80, 100', animation: 'rotate-c11 10s infinite cubic-bezier(0.645, 0.045, 0.355, 1)' }} />
                            </svg>

                            {/* CPU */}
                            <div
                                className="absolute flex flex-col justify-center items-center w-full h-full"
                                style={{
                                    color: colors.blue,
                                    transition: 'transform 1s ease-out',
                                    transform: is3D ? 'translateZ(420px)' : 'none',
                                }}
                            >
                                <p className="m-0" style={{ fontSize: '0.8vw' }}>MB26</p>
                                <p className="m-0" style={{ fontSize: '0.8vw' }}>{cpuPercent}%</p>
                            </div>

                            {/* SKEW SQUARES */}
                            <div
                                className="absolute w-full h-full flex flex-col justify-center items-center -z-10"
                                style={{
                                    willChange: 'transform',
                                    transition: 'transform 1s ease-out',
                                    transform: is3D
                                        ? (isBoost ? 'translateZ(50px) scale(5)' : 'translateZ(350px)')
                                        : (isBoost ? 'translateZ(50px) scale(5)' : 'none'),
                                }}
                            >
                                <div
                                    className="absolute w-full h-full flex flex-col justify-center items-center"
                                    style={{
                                        willChange: 'transform',
                                        animation: 'speed 2s infinite linear',
                                    }}
                                >
                                    {squareTransforms.map((transformValue, i) => (
                                        <div
                                            key={i}
                                            className="absolute"
                                            style={{
                                                background: colors.blue,
                                                transformOrigin: '50% 50%',
                                                width: '25px',
                                                height: '15px',
                                                boxShadow: `1px 1px 10px ${colors.blue}`,
                                                transition: 'all 1s ease-in',
                                                willChange: 'transform',
                                                transform: transformValue,
                                                animation: isBoost ? 'changeColor 5s linear 1 forwards' : 'none',
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* RECTANGLES */}
                            <div
                                className="absolute w-full h-full flex flex-col justify-center items-center"
                                style={{
                                    willChange: 'transform',
                                    transition: 'transform 1s ease-out',
                                    transform: is3D ? 'translateZ(250px)' : 'none',
                                }}
                            >
                                {rectangleTransforms.map((transformValue, i) => (
                                    <div
                                        key={i}
                                        className="absolute"
                                        style={{
                                            background: colors.green,
                                            border: `3px solid ${colors.blue}`,
                                            borderRadius: '20%',
                                            width: '45px',
                                            height: '25px',
                                            transform: transformValue,
                                        }}
                                    />
                                ))}
                            </div>

                            {/* SYMBOLS */}
                            <div
                                className="absolute w-full h-full flex flex-col justify-center items-center"
                                style={{
                                    transition: 'transform 1s ease-out',
                                    transform: is3D ? 'translateZ(150px)' : 'none',
                                }}
                            >
                                {symbolValues.map((val, i) => (
                                    <div
                                        key={i}
                                        className="absolute flex flex-col justify-center items-center"
                                        style={{
                                            transformOrigin: '50% 50%',
                                            width: '30px',
                                            height: '40px',
                                            color: colors.white,
                                            transform: symbolTransforms[i],
                                        }}
                                    >
                                        <p className="m-0" style={{ filter: `drop-shadow(0.1px 0.1px 1px ${colors.white})` }}>{val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOREGROUND LAYER - CONTROLS */}
            {/* <div className="fixed top-20 right-5 z-[100] flex flex-col gap-4">
                <div
                    className="w-[120px] h-10 text-sm rounded flex justify-center items-center cursor-pointer font-bold tracking-wider transition-all duration-300 ease-in-out hover:text-black"
                    style={{
                        border: `1px solid ${colors.blue}`,
                        boxShadow: `0px 0px 5px ${colors.blue}`,
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(5px)',
                        color: colors.white,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.blue;
                        e.currentTarget.style.color = 'black';
                        e.currentTarget.style.boxShadow = `0px 0px 15px ${colors.blue}`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        e.currentTarget.style.color = colors.white;
                        e.currentTarget.style.boxShadow = `0px 0px 5px ${colors.blue}`;
                    }}
                    onClick={() => setIs3D(!is3D)}
                >
                    <p>3D MODE</p>
                </div>
                <div
                    className="w-[120px] h-10 text-sm rounded flex justify-center items-center cursor-pointer font-bold tracking-wider transition-all duration-300 ease-in-out hover:text-black"
                    style={{
                        border: `1px solid ${colors.blue}`,
                        boxShadow: `0px 0px 5px ${colors.blue}`,
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(5px)',
                        color: colors.white,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.blue;
                        e.currentTarget.style.color = 'black';
                        e.currentTarget.style.boxShadow = `0px 0px 15px ${colors.blue}`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        e.currentTarget.style.color = colors.white;
                        e.currentTarget.style.boxShadow = `0px 0px 5px ${colors.blue}`;
                    }}
                    onClick={() => setIsBoost(!isBoost)}
                >
                    <p>BOOST</p>
                </div>
                <div
                    className="w-[120px] h-10 text-sm rounded flex justify-center items-center cursor-pointer font-bold tracking-wider transition-all duration-300 ease-in-out hover:text-black"
                    style={{
                        border: `1px solid ${colors.blue}`,
                        boxShadow: `0px 0px 5px ${colors.blue}`,
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(5px)',
                        color: colors.white,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.blue;
                        e.currentTarget.style.color = 'black';
                        e.currentTarget.style.boxShadow = `0px 0px 15px ${colors.blue}`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                        e.currentTarget.style.color = colors.white;
                        e.currentTarget.style.boxShadow = `0px 0px 5px ${colors.blue}`;
                    }}
                    onClick={() => setIsInspect(!isInspect)}
                >
                    <p>INSPECT</p>
                </div>
            </div> */}
        </>
    );
};

export default TechnicalBackground;
