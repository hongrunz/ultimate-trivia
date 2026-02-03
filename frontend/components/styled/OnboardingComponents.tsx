import styled from 'styled-components';
import { colors, typography } from './theme';

export const OnboardingContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  width: 100%;
`;

export const OnboardingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  width: 100%;
  max-width: 32rem;
`;

export const OnboardingTitleImage = styled.img`
  width: 100%;
  max-width: 28rem;
  height: auto;
  display: block;
`;

export const OnboardingExplanationCard = styled.div`
  background-color: #ffffff20;
  border-radius: 32px;
  padding: 1rem 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const OnboardingIllustration = styled.div`
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;


export const OnboardingExplanationText = styled.p`
  flex: 1;
  margin: 0;
  font-family: ${typography.presets.Commentary.fontFamily};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.presets.body.fontWeight};
  line-height: ${typography.presets.body.lineHeight};
  color: ${colors.surface};
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

export const OnboardingButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
