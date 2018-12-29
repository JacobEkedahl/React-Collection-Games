import React from 'react';
import Bullet from './Bullet';

class Bullets extends React.Component {
    render() {
        return (
            <div>
                {this.props.bullets.map((bullet) => {
                    return <Bullet bullet={bullet} key={bullet.id} />
                })}
            </div>
        )
    }
}

export default Bullets;