
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Background scaling animation
const animateBg = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
`;

// Animation for shooting star movement
const animateStar = keyframes`
  0% {
    transform: rotate(315deg) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(315deg) translateX(-1000px);
    opacity: 0;
  }
`;

// Container for stars
const StarsSection = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: url("");
  background-size: cover;
  animation: ${animateBg} 50s linear infinite;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

// Individual star styling
const Star = styled.span`
  position: absolute;
  width: 200px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.1),
    0 0 0 8px rgba(255, 255, 255, 0.1),
    0 0 20px rgba(255, 255, 255, 0.1);
  animation: ${animateStar} ${({ duration }) => duration}s linear infinite;
  animation-delay: ${({ delay }) => delay}s;
  opacity: 0;

  top: ${({ top }) => top}px;
  right: ${({ right }) => right}px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 300px;
    height: 1px;
    background: linear-gradient(90deg, #fff, transparent);
  }
`;

const ShootingStars = ({ starCount = 30 }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const generated = [];

      for (let i = 0; i < starCount; i++) {
        generated.push({
          top: Math.floor(Math.random() * height),
          right: Math.floor(Math.random() * width),
          delay: Math.random() * 5,
          duration: 1 + Math.random() * 10
        });
      }

      setStars(generated);
    };

    generateStars();

    window.addEventListener('resize', generateStars);
    return () => window.removeEventListener('resize', generateStars);
  }, [starCount]);

  return (
    <StarsSection>
      {stars.map((star, idx) => (
        <Star
          key={idx}
          top={star.top}
          right={star.right}
          delay={star.delay}
          duration={star.duration}
        />
      ))}
    </StarsSection>
  );
};

export default ShootingStars;
