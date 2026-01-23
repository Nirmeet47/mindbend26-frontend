import React from 'react';

const PreloaderText = () => {
    return (
        <div
            className="preloader-text-container relative flex items-center justify-center z-10"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
        >
            {/* M Letter */}
            <div className="letter-m preloader-letter text-8xl md:text-9xl font-black text-white tracking-wider z-10">
                <div className="overflow-hidden">
                    <div className="letter-inner">M</div>
                </div>
            </div>

            {/* IND Letters */}
            <div className="letter-ind preloader-letter text-8xl md:text-9xl font-black text-white tracking-wider overflow-hidden">
                <div className="overflow-hidden">
                    <div className="letter-inner">IND</div>
                </div>
            </div>

            {/* Spacer for video (invisible, just to maintain text positioning) */}
            <div className="video-spacer" style={{ width: 0 }} />

            {/* B Letter */}
            <div className="letter-b preloader-letter text-8xl md:text-9xl font-black text-white tracking-wider z-10">
                <div className="overflow-hidden">
                    <div className="letter-inner">B</div>
                </div>
            </div>

            {/* END Letters */}
            <div className="letter-end preloader-letter text-8xl md:text-9xl font-black text-white tracking-wider overflow-hidden">
                <div className="overflow-hidden">
                    <div className="letter-inner">END</div>
                </div>
            </div>
        </div>
    );
};

export default PreloaderText;
