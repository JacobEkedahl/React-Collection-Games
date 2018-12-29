import React from 'react';

class Bullet extends React.Component {
    render() {
        return (
            <div
                className="Bullet"
                style={{
                    left: this.props.bullet.x,
                    top: this.props.bullet.y,
                    width: this.props.bullet.w,
                    height: this.props.bullet.h,
                    speed: this.props.bullet.speed,
                }}
            >
            </div>
        )
    }
}

export default Bullet;