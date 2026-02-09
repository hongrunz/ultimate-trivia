# Frontend Styling Customization Guide

This document lists all the styling elements you can customize in the Wildcard Trivia frontend. All styles are defined using styled-components, making them easy to modify.

## 📁 File Locations

All styled components are located in:
- `frontend/components/styled/FormComponents.tsx` - Form elements, buttons, inputs
- `frontend/components/styled/GameComponents.tsx` - Game screen elements
- `frontend/components/styled/BigScreenComponents.tsx` - Big screen display elements
- `frontend/components/styled/ErrorComponents.tsx` - Error messages and boxes
- `frontend/components/styled/InfoComponents.tsx` - Info boxes and notices
- `frontend/components/styled/StatusComponents.tsx` - Status messages
- `frontend/components/styled/MusicControlComponent.tsx` - Music control button
- `frontend/components/styled/OptionsContainer.tsx` - Question option buttons
- `app/globals.css` - Global CSS variables and body styles

---

## 🎨 Color Customization

### Color Theme Variables

All colors are now defined as variables in `frontend/components/styled/theme.ts`. Import and use them like this:

```typescript
import { colors } from './theme';

// Example usage in styled components:
background-color: ${colors.primary};
border-color: ${colors.border};
color: ${colors.typeMain};
```

**Available Color Variables:**
- `colors.primary` - #6ABBFE (Primary blue)
- `colors.border` - #469BE2 (Border blue)
- `colors.bgContrast` - #0E6AB6 (Background contrast blue)
- `colors.accent` - #F6D705 (Accent yellow)
- `colors.surface` - #FFFFFF (White surface)
- `colors.surfaceSecondary` - rgba(72, 128, 175, 0.05) (Surface secondary with 5% opacity)
- `colors.primarySelected` - #123858 (Selected primary state)
- `colors.typeAccent` - #EDBA00 (Accent text color)
- `colors.typeMain` - #253441 (Main text color)
- `colors.typeSecondary` - #89929A (Secondary text color)

**Legacy Colors:** The theme file also includes backward-compatible gray, blue, green, red, and other color scales for existing components.

📖 **See `frontend/components/styled/THEME_USAGE_EXAMPLES.md` for detailed examples on how to use these variables in your styled components.**

### Background Colors
- **Page Container Background** (`PageContainer`)
  - Current: `#6ABBFE` (primary)
  - Location: `FormComponents.tsx:6`

- **Form Card Background** (`FormCard`)
  - Current: `#e5e7eb` (light gray)
  - Location: `FormComponents.tsx:15`

- **Game Screen Background** (`GameScreenContainer`)
  - Current: `#4b5563` (dark gray)
  - Location: `GameComponents.tsx:75`

- **Game Card Background** (`GameCard`)
  - Current: `#e5e7eb` (light gray)
  - Location: `GameComponents.tsx:84`

- **Big Screen Card Background** (`BigScreenCard`)
  - Current: `#e5e7eb` (light gray)
  - Location: `BigScreenComponents.tsx:10`

- **QR Code Container Background** (`QRCodeContainer`)
  - Current: `#ffffff` (white)
  - Location: `GameComponents.tsx:4`

### Text Colors
- **Primary Title Color** (`Title`, `GameTitle`)
  - Current: `#000000` (black)
  - Locations: `FormComponents.tsx:26`, `GameComponents.tsx:117`

- **Label Color** (`Label`)
  - Current: `#1f2937` (gray-800)
  - Location: `FormComponents.tsx:45`

- **Input Text Color** (`Input`, `AnswerInput`)
  - Current: `#111827` (gray-900)
  - Locations: `FormComponents.tsx:56`, `GameComponents.tsx:135`

- **Question Text Color** (`QuestionText`, `BigScreenQuestionText`)
  - Current: `#000000` (black)
  - Locations: `GameComponents.tsx:124`, `BigScreenComponents.tsx:58`

- **Muted Text Color** (`MutedText`)
  - Current: `#6b7280` (gray-500)
  - Location: `StatusComponents.tsx:11`

- **Helper Text Color** (`HelperText`, `Text`)
  - Current: `#4b5563` (gray-600)
  - Locations: `FormComponents.tsx:190`, `FormComponents.tsx:195`

- **Link Color** (`LinkText`, `StyledLink`)
  - Current: `#2563eb` (blue-600)
  - Locations: `FormComponents.tsx:162`, `FormComponents.tsx:176`

### Button Colors
- **Primary Button Background** (`ButtonPrimary`)
  - Current: `#e5e7eb` (light gray) with black border
  - Location: `FormComponents.tsx:125-127`
  - Hover: `#d1d5db` (darker gray)
  - Disabled: `#e5e7eb` with gray text

- **Success Button Background** (`ButtonSuccess`)
  - Current: `#16a34a` (green-600)
  - Location: `FormComponents.tsx:141`
  - Hover: `#15803d` (green-700)

- **Base Button Background** (`Button`, `ButtonLarge`)
  - Current: `#2563eb` (blue-600)
  - Location: `FormComponents.tsx:101`
  - Hover: `#1d4ed8` (blue-700)
  - Disabled: `#9ca3af` (gray-400)

- **Option Button Background** (`OptionButton`)
  - Current: `#ffffff` (white)
  - Location: `OptionsContainer.tsx:20`
  - Hover: `#f3f4f6` (gray-100)

### Border Colors
- **Form Card Border** (`FormCard`)
  - Current: `#000000` (black), 2px solid
  - Location: `FormComponents.tsx:16`

- **Input Border** (`Input`, `AnswerInput`)
  - Current: `#9ca3af` (gray-400)
  - Locations: `FormComponents.tsx:53`, `GameComponents.tsx:132`
  - Focus: `#3b82f6` (blue-500) with shadow

- **Option Button Border** (`OptionButton`)
  - Current: `#9ca3af` (gray-400)
  - Location: `OptionsContainer.tsx:18`
  - Hover: `#6b7280` (gray-500)
  - Focus: `#3b82f6` (blue-500)

### Error Colors
- **Error Text Color** (`ErrorText`)
  - Current: `#dc2626` (red-600)
  - Location: `ErrorComponents.tsx:33`

- **Error Box Background** (`ErrorBox`)
  - Current: `#fee2e2` (red-100)
  - Location: `ErrorComponents.tsx:8`

- **Error Box Border** (`ErrorBox`)
  - Current: `#dc2626` (red-600), 2px solid
  - Location: `ErrorComponents.tsx:10`

- **Error Heading Color** (`ErrorHeading`)
  - Current: `#dc2626` (red-600)
  - Location: `ErrorComponents.tsx:21`

- **Error Title Color** (`ErrorTitle`)
  - Current: `#ef4444` (red-500)
  - Location: `BigScreenComponents.tsx:166`

### Success Colors
- **Success Text Color** (`SuccessText`)
  - Current: `#16a34a` (green-600)
  - Location: `StatusComponents.tsx:5`

### Info Box Colors
- **Info Box Background (Web)** (`InfoBox` - web variant)
  - Current: `#dbeafe` (blue-100)
  - Location: `InfoComponents.tsx:8`

- **Info Box Background (Mobile)** (`InfoBox` - mobile variant)
  - Current: `#fef3c7` (yellow-100)
  - Location: `InfoComponents.tsx:8`

- **Big Screen Notice Background** (`BigScreenNotice`)
  - Current: `#dbeafe` (blue-100)
  - Location: `InfoComponents.tsx:19`

- **Big Screen Notice Border** (`BigScreenNotice`)
  - Current: `#3b82f6` (blue-500), 2px solid
  - Location: `InfoComponents.tsx:23`

- **Warning Text Color** (`WarningText`)
  - Current: `#dc2626` (red-600)
  - Location: `InfoComponents.tsx:28`

### Badge & Avatar Colors
- **Circular Badge Background** (`CircularBadge`, `BigScreenBadge`)
  - Current: `#ffffff` (white)
  - Locations: `GameComponents.tsx:105`, `BigScreenComponents.tsx:41`

- **Circular Badge Text** (`CircularBadge`, `BigScreenBadge`)
  - Current: `#000000` (black)
  - Locations: `GameComponents.tsx:111`, `BigScreenComponents.tsx:47`

- **Player Avatar Background** (`PlayerAvatar`)
  - Current: Dynamic colors (blue, red, green, amber, violet, pink, teal, orange)
  - Location: `GameComponents.tsx:13-17`
  - Colors array: `['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']`

- **Topic Badge Background** (`TopicBadge`)
  - Current: `rgba(59, 130, 246, 0.1)` (blue with 10% opacity)
  - Location: `GameComponents.tsx:65`

- **Topic Badge Border** (`TopicBadge`)
  - Current: `rgba(59, 130, 246, 0.3)` (blue with 30% opacity)
  - Location: `GameComponents.tsx:66`

- **Topic Badge Text** (`TopicBadge`)
  - Current: `#3b82f6` (blue-500)
  - Location: `GameComponents.tsx:69`

### Big Screen Option Colors
- **Big Screen Option Box Background** (`BigScreenOptionBox`)
  - Default: `#ffffff` (white)
  - Correct Answer (when shown): `#10b981` (green-500)
  - Location: `BigScreenComponents.tsx:93-94`

- **Big Screen Option Box Text** (`BigScreenOptionBox`)
  - Default: `#111827` (gray-900)
  - Correct Answer (when shown): `#ffffff` (white)
  - Location: `BigScreenComponents.tsx:95-96`

### Music Control Colors
- **Music Button Background** (`MusicButton`)
  - Current: `rgba(59, 130, 246, 0.9)` (blue with 90% opacity)
  - Location: `MusicControlComponent.tsx:15`
  - Hover: `rgba(37, 99, 235, 1)` (blue-600)

- **Music Button Border** (`MusicButton`)
  - Current: `#ffffff` (white), 2px solid
  - Location: `MusicControlComponent.tsx:14`

- **Music Button Text** (`MusicButton`)
  - Current: `#ffffff` (white)
  - Location: `MusicControlComponent.tsx:16`

- **Muted Slash Color** (`MusicButton` when muted)
  - Current: `#ef4444` (red-500)
  - Location: `MusicControlComponent.tsx:47`

- **Tooltip Background** (`Tooltip`)
  - Current: `rgba(0, 0, 0, 0.9)` (black with 90% opacity)
  - Location: `MusicControlComponent.tsx:58`

- **Tooltip Text** (`Tooltip`)
  - Current: `#ffffff` (white)
  - Location: `MusicControlComponent.tsx:59`

- **Tooltip Link** (`TooltipLink`)
  - Current: `#60a5fa` (blue-400)
  - Location: `MusicControlComponent.tsx:95`

### Leaderboard Colors
- **Leaderboard Section Background** (`BigScreenLeaderboardSection`)
  - Current: `#ffffff` (white)
  - Location: `BigScreenComponents.tsx:130`

- **Leaderboard Section Border** (`BigScreenLeaderboardSection`)
  - Current: `#9ca3af` (gray-400), 1px solid
  - Location: `BigScreenComponents.tsx:133`

---

## 🔤 Font Customization

### Font Families
- **Body Font** (`body` in `globals.css`)
  - Current: `Arial, Helvetica, sans-serif`
  - Location: `globals.css:32`

- **Custom Font (Shadows Into Light)** (`.shadows-into-light-regular`)
  - Current: `var(--font-shadows-into-light), cursive`
  - Location: `globals.css:17`
  - Note: This font is defined but may not be actively used

### Font Sizes
- **Page Title** (`Title`)
  - Current: `1.875rem` (30px / text-3xl)
  - Location: `FormComponents.tsx:24`

- **Game Title** (`GameTitle`)
  - Current: `1.875rem` (30px)
  - Location: `GameComponents.tsx:115`

- **Big Screen Question Text** (`BigScreenQuestionText`)
  - Current: `3rem` (48px) - desktop
  - Responsive: `2rem` (32px) - tablet, `1.5rem` (24px) - mobile
  - Location: `BigScreenComponents.tsx:57-72`

- **Question Text** (`QuestionText`)
  - Current: `1rem` (16px)
  - Location: `GameComponents.tsx:123`

- **Input Text** (`Input`, `AnswerInput`)
  - Current: `1rem` (16px)
  - Locations: `FormComponents.tsx:57`, `GameComponents.tsx:136`

- **Label Text** (`Label`)
  - Current: Inherits from parent (default)
  - Location: `FormComponents.tsx:42-46`

- **Button Text** (`Button`, `ButtonPrimary`, etc.)
  - Current: Default (varies by button type)
  - Location: `FormComponents.tsx:99-146`

- **Option Button Text** (`OptionButton`)
  - Current: `0.95rem` (15.2px)
  - Location: `OptionsContainer.tsx:22`

- **Topic Badge Text** (`TopicBadge`)
  - Current: `0.875rem` (14px)
  - Location: `GameComponents.tsx:68`

- **Circular Badge Text** (`CircularBadge`)
  - Current: `1rem` (16px)
  - Location: `GameComponents.tsx:110`

- **Big Screen Badge Text** (`BigScreenBadge`)
  - Current: `2rem` (32px) - desktop
  - Responsive: `1rem` (16px) - mobile
  - Location: `BigScreenComponents.tsx:46-53`

- **Error Text** (`ErrorText`)
  - Current: `0.875rem` (14px)
  - Location: `ErrorComponents.tsx:35`

- **Muted Text** (`MutedText`)
  - Current: `0.875rem` (14px)
  - Location: `StatusComponents.tsx:12`

- **Helper Text** (`HelperText`, `Text`)
  - Current: `0.875rem` (14px)
  - Locations: `FormComponents.tsx:191`, `FormComponents.tsx:196`

- **Link Text** (`LinkText`, `StyledLink`)
  - Current: `0.875rem` (14px)
  - Locations: `FormComponents.tsx:164`, `FormComponents.tsx:178`

- **Leaderboard Heading** (`LeaderboardHeading`)
  - Current: `1rem` (16px)
  - Location: `GameComponents.tsx:159`

- **Big Screen Leaderboard Heading** (`BigScreenLeaderboardHeading`)
  - Current: `2rem` (32px) - desktop
  - Responsive: `1rem` (16px) - mobile
  - Location: `BigScreenComponents.tsx:141-147`

- **Leaderboard Item** (`LeaderboardItem`)
  - Current: `1rem` (16px)
  - Location: `GameComponents.tsx:172`

- **Big Screen Leaderboard Item** (`BigScreenLeaderboardItem`)
  - Current: `1.5rem` (24px) - desktop
  - Responsive: `1rem` (16px) - mobile
  - Location: `BigScreenComponents.tsx:151-159`

- **Big Screen Explanation** (`BigScreenExplanation`)
  - Current: `1.5rem` (24px) - desktop
  - Responsive: `1rem` (16px) - mobile
  - Location: `BigScreenComponents.tsx:118-125`

- **Music Button Text** (`MusicButton`)
  - Current: `1.75rem` (28px)
  - Location: `MusicControlComponent.tsx:21`

- **Tooltip Text** (`Tooltip`)
  - Current: `0.875rem` (14px)
  - Location: `MusicControlComponent.tsx:62`

### Font Weights
- **Title/Heading** (`Title`, `GameTitle`)
  - Current: `700` (bold)
  - Locations: `FormComponents.tsx:25`, `GameComponents.tsx:116`

- **Button Text** (`Button`)
  - Current: `500` (medium)
  - Location: `FormComponents.tsx:105`

- **Button Large Text** (`ButtonLarge`)
  - Current: `600` (semi-bold)
  - Location: `FormComponents.tsx:121`

- **Option Button Text** (`OptionButton`)
  - Current: `600` (semi-bold)
  - Location: `OptionsContainer.tsx:23`

- **Circular Badge Text** (`CircularBadge`, `BigScreenBadge`)
  - Current: `700` (bold)
  - Locations: `GameComponents.tsx:109`, `BigScreenComponents.tsx:45`

- **Player Avatar Text** (`PlayerAvatar`)
  - Current: `700` (bold)
  - Location: `GameComponents.tsx:22`

- **Question Text** (`BigScreenQuestionText`)
  - Current: `600` (semi-bold)
  - Location: `BigScreenComponents.tsx:62`

- **Feedback Message** (`FeedbackMessage`)
  - Current: `600` (semi-bold)
  - Location: `GameComponents.tsx:148`

- **Leaderboard Heading** (`LeaderboardHeading`)
  - Current: `600` (semi-bold)
  - Location: `GameComponents.tsx:160`

- **Success Text** (`SuccessText`)
  - Current: `600` (semi-bold)
  - Location: `StatusComponents.tsx:6`

- **Warning Text** (`WarningText`)
  - Current: `bold`
  - Location: `InfoComponents.tsx:29`

---

## 🔲 Border & Border Radius Customization

### Border Widths
- **Form Card Border** (`FormCard`)
  - Current: `2px solid`
  - Location: `FormComponents.tsx:16`

- **Button Primary Border** (`ButtonPrimary`)
  - Current: `2px solid`
  - Location: `FormComponents.tsx:127`

- **Input Border** (`Input`, `AnswerInput`)
  - Current: `1px solid`
  - Locations: `FormComponents.tsx:53`, `GameComponents.tsx:132`

- **Option Button Border** (`OptionButton`)
  - Current: `1px solid`
  - Location: `OptionsContainer.tsx:18`

- **Big Screen Option Box Border** (`BigScreenOptionBox`)
  - Current: `2px solid`
  - Location: `BigScreenComponents.tsx:91`

- **Error Box Border** (`ErrorBox`)
  - Current: `2px solid`
  - Location: `ErrorComponents.tsx:10`

- **Big Screen Notice Border** (`BigScreenNotice`)
  - Current: `2px solid`
  - Location: `InfoComponents.tsx:23`

- **Music Button Border** (`MusicButton`)
  - Current: `2px solid`
  - Location: `MusicControlComponent.tsx:14`

- **Big Screen Leaderboard Section Border** (`BigScreenLeaderboardSection`)
  - Current: `1px solid`
  - Location: `BigScreenComponents.tsx:133`

- **Big Screen Explanation Border** (`BigScreenExplanation`)
  - Current: `1px solid`
  - Location: `BigScreenComponents.tsx:120`

### Border Radius
- **Form Card Border Radius** (`FormCard`)
  - Current: `0` (square corners)
  - Location: `FormComponents.tsx:17`

- **Input Border Radius** (`Input`, `AnswerInput`)
  - Current: `0.25rem` (4px)
  - Locations: `FormComponents.tsx:54`, `GameComponents.tsx:133`

- **Button Border Radius** (`Button`, `ButtonPrimary`, etc.)
  - Current: `0.25rem` (4px)
  - Location: `FormComponents.tsx:104`

- **Option Button Border Radius** (`OptionButton`)
  - Current: `0.375rem` (6px)
  - Location: `OptionsContainer.tsx:19`

- **QR Code Container Border Radius** (`QRCodeContainer`)
  - Current: `0.5rem` (8px)
  - Location: `GameComponents.tsx:6`

- **Circular Badge Border Radius** (`CircularBadge`, `BigScreenBadge`, `PlayerAvatar`)
  - Current: `50%` (fully rounded)
  - Locations: `GameComponents.tsx:104`, `BigScreenComponents.tsx:40`, `GameComponents.tsx:16`

- **Music Button Border Radius** (`MusicButton`)
  - Current: `50%` (fully rounded)
  - Location: `MusicControlComponent.tsx:13`

- **Error Box Border Radius** (`ErrorBox`)
  - Current: `0.5rem` (8px)
  - Location: `ErrorComponents.tsx:9`

- **Info Box Border Radius** (`InfoBox`, `BigScreenNotice`)
  - Current: `0.5rem` (8px)
  - Locations: `InfoComponents.tsx:9`, `InfoComponents.tsx:20`

- **Topic Badge Border Radius** (`TopicBadge`)
  - Current: `1rem` (16px - fully rounded)
  - Location: `GameComponents.tsx:67`

- **Big Screen Option Box Border Radius** (`BigScreenOptionBox`)
  - Current: `0.5rem` (8px)
  - Location: `BigScreenComponents.tsx:92`

- **Big Screen Explanation Border Radius** (`BigScreenExplanation`)
  - Current: `0.5rem` (8px)
  - Location: `BigScreenComponents.tsx:116`

- **Big Screen Leaderboard Section Border Radius** (`BigScreenLeaderboardSection`)
  - Current: `0.5rem` (8px)
  - Location: `BigScreenComponents.tsx:132`

- **Tooltip Border Radius** (`Tooltip`)
  - Current: `0.5rem` (8px)
  - Location: `MusicControlComponent.tsx:61`

---

## 📏 Spacing & Sizing Customization

### Padding
- **Page Container Padding** (`PageContainer`)
  - Current: `1rem` (16px)
  - Location: `FormComponents.tsx:11`

- **Form Card Padding** (`FormCard`)
  - Current: `2rem` (32px)
  - Location: `FormComponents.tsx:18`

- **Game Card Padding** (`GameCard`)
  - Current: `2rem` (32px)
  - Location: `GameComponents.tsx:87`

- **Big Screen Card Padding** (`BigScreenCard`)
  - Current: `4rem` (64px) - desktop
  - Responsive: `3rem` (48px) - tablet, `2rem` (32px) - mobile
  - Location: `BigScreenComponents.tsx:13-27`

- **Input Padding** (`Input`, `AnswerInput`)
  - Current: `0.5rem` (8px)
  - Locations: `FormComponents.tsx:50`, `GameComponents.tsx:131`

- **Button Padding** (`Button`)
  - Current: `0.75rem 1.5rem` (12px vertical, 24px horizontal)
  - Location: `FormComponents.tsx:100`

- **Button Large Padding** (`ButtonLarge`)
  - Current: `0.75rem 2rem` (12px vertical, 32px horizontal)
  - Location: `FormComponents.tsx:120`

- **Option Button Padding** (`OptionButton`)
  - Current: `0.75rem 0.75rem` (12px all sides)
  - Location: `OptionsContainer.tsx:17`

- **Big Screen Option Box Padding** (`BigScreenOptionBox`)
  - Current: `2.5rem` (40px) - desktop
  - Responsive: `1.5rem` (24px) - tablet, `0.75rem` (12px) - mobile
  - Location: `BigScreenComponents.tsx:90-110`

- **QR Code Container Padding** (`QRCodeContainer`)
  - Current: `1rem` (16px)
  - Location: `GameComponents.tsx:5`

- **Topic Badge Padding** (`TopicBadge`)
  - Current: `0.5rem 1rem` (8px vertical, 16px horizontal)
  - Location: `GameComponents.tsx:64`

- **Error Box Padding** (`ErrorBox`)
  - Current: `1.5rem` (24px)
  - Location: `ErrorComponents.tsx:7`

- **Info Box Padding** (`InfoBox`)
  - Current: `0.5rem` (8px)
  - Location: `InfoComponents.tsx:7`

- **Big Screen Notice Padding** (`BigScreenNotice`)
  - Current: `1rem` (16px)
  - Location: `InfoComponents.tsx:18`

- **Big Screen Explanation Padding** (`BigScreenExplanation`)
  - Current: `2rem` (32px) - desktop
  - Responsive: `1rem` (16px) - mobile
  - Location: `BigScreenComponents.tsx:114-125`

- **Big Screen Leaderboard Section Padding** (`BigScreenLeaderboardSection`)
  - Current: `2rem` (32px) - desktop
  - Responsive: `1rem` (16px) - mobile
  - Location: `BigScreenComponents.tsx:131-137`

- **Tooltip Padding** (`Tooltip`)
  - Current: `0.75rem 1rem` (12px vertical, 16px horizontal)
  - Location: `MusicControlComponent.tsx:60`

### Margins
- **Title Margin Bottom** (`Title`, `GameTitle`)
  - Current: `2rem` (32px)
  - Locations: `FormComponents.tsx:28`, `GameComponents.tsx:119`

- **Form Group Gap** (`FormGroup`)
  - Current: `1.5rem` (24px)
  - Location: `FormComponents.tsx:34`

- **Label Margin Bottom** (`Label`)
  - Current: `0.5rem` (8px)
  - Location: `FormComponents.tsx:44`

- **Input Margin Bottom** (`Input`)
  - Current: `1rem` (16px)
  - Location: `FormComponents.tsx:52`

- **Button Container Margin Top** (`ButtonContainer`, `ButtonContainerCenter`)
  - Current: `2rem` (32px)
  - Locations: `FormComponents.tsx:149`, `FormComponents.tsx:156`

- **Question Text Margin Bottom** (`QuestionText`)
  - Current: `1.5rem` (24px)
  - Location: `GameComponents.tsx:125`

- **Answer Input Margin Bottom** (`AnswerInput`)
  - Current: `1.5rem` (24px)
  - Location: `GameComponents.tsx:137`

- **Feedback Message Margin Bottom** (`FeedbackMessage`)
  - Current: `1.5rem` (24px)
  - Location: `GameComponents.tsx:151`

- **Leaderboard Section Margin Top** (`LeaderboardSection`)
  - Current: `2rem` (32px)
  - Location: `GameComponents.tsx:155`

- **Leaderboard Heading Margin Bottom** (`LeaderboardHeading`)
  - Current: `1rem` (16px)
  - Location: `GameComponents.tsx:162`

- **Leaderboard Item Margin Bottom** (`LeaderboardItem`)
  - Current: `0.5rem` (8px)
  - Location: `GameComponents.tsx:174`

- **Game Header Margin Bottom** (`GameHeader`)
  - Current: `2rem` (32px)
  - Location: `GameComponents.tsx:98`

- **Big Screen Header Margin Bottom** (`BigScreenHeader`)
  - Current: `3rem` (48px)
  - Location: `BigScreenComponents.tsx:34`

- **Big Screen Question Text Margin Bottom** (`BigScreenQuestionText`)
  - Current: `3rem` (48px) - desktop
  - Responsive: `2rem` (32px) - tablet, `1.5rem` (24px) - mobile
  - Location: `BigScreenComponents.tsx:59-72`

- **Big Screen Options Container Margin Bottom** (`BigScreenOptionsContainer`)
  - Current: `3rem` (48px) - desktop
  - Responsive: `1.5rem` (24px) - mobile
  - Location: `BigScreenComponents.tsx:80-85`

- **Big Screen Explanation Margin Bottom** (`BigScreenExplanation`)
  - Current: `2rem` (32px)
  - Location: `BigScreenComponents.tsx:117`

- **Big Screen Leaderboard Section Margin Top** (`BigScreenLeaderboardSection`)
  - Current: `2rem` (32px)
  - Location: `BigScreenComponents.tsx:129`

- **Big Screen Leaderboard Heading Margin Bottom** (`BigScreenLeaderboardHeading`)
  - Current: `1.5rem` (24px) - desktop
  - Responsive: `1rem` (16px) - mobile
  - Location: `BigScreenComponents.tsx:142-147`

- **Big Screen Leaderboard Item Margin Bottom** (`BigScreenLeaderboardItem`)
  - Current: `1rem` (16px) - desktop
  - Responsive: `0.5rem` (8px) - mobile
  - Location: `BigScreenComponents.tsx:152-159`

- **Error Text Margin Top** (`ErrorText`)
  - Current: `1rem` (16px)
  - Location: `ErrorComponents.tsx:34`

- **Error Icon Margin Bottom** (`ErrorIcon`)
  - Current: `1rem` (16px)
  - Location: `ErrorComponents.tsx:15`

- **Error Heading Margin Bottom** (`ErrorHeading`)
  - Current: `0.5rem` (8px)
  - Location: `ErrorComponents.tsx:22`

- **Error Message Margin Top** (`ErrorMessage`)
  - Current: `0.5rem` (8px)
  - Location: `ErrorComponents.tsx:28`

- **Info Box Margin Bottom** (`InfoBox`)
  - Current: `1rem` (16px)
  - Location: `InfoComponents.tsx:6`

- **Big Screen Notice Margin Bottom** (`BigScreenNotice`)
  - Current: `1.5rem` (24px)
  - Location: `InfoComponents.tsx:17`

- **QR Code Container Margin Bottom** (`QRCodeContainer`)
  - Current: `1rem` (16px)
  - Location: `GameComponents.tsx:7`

- **Topics Section Margin Bottom** (`TopicsSection`)
  - Current: `2rem` (32px)
  - Location: `GameComponents.tsx:52`

- **Bottom Section Margin Top** (`BottomSection`)
  - Current: `2rem` (32px)
  - Location: `GameComponents.tsx:48`

### Widths & Heights
- **Form Card Max Width** (`FormCard`)
  - Current: `28rem` (448px)
  - Location: `FormComponents.tsx:20`

- **Game Card Max Width** (`GameCard`)
  - Current: `28rem` (448px)
  - Location: `GameComponents.tsx:86`

- **Game Card Min Height** (`GameCard`)
  - Current: `400px`
  - Location: `GameComponents.tsx:91`

- **Big Screen Card Max Width** (`BigScreenCard`)
  - Current: `90rem` (1440px) - desktop
  - Responsive: `60rem` (960px) - tablet, `28rem` (448px) - mobile
  - Location: `BigScreenComponents.tsx:12-27`

- **Big Screen Card Min Height** (`BigScreenCard`)
  - Current: `600px`
  - Location: `BigScreenComponents.tsx:17`

- **Circular Badge Size** (`CircularBadge`)
  - Current: `3rem × 3rem` (48px × 48px)
  - Location: `GameComponents.tsx:102-103`

- **Big Screen Badge Size** (`BigScreenBadge`)
  - Current: `5rem × 5rem` (80px × 80px) - desktop
  - Responsive: `3rem × 3rem` (48px × 48px) - mobile
  - Location: `BigScreenComponents.tsx:38-53`

- **Player Avatar Size** (`PlayerAvatar`)
  - Current: `3rem × 3rem` (48px × 48px)
  - Location: `GameComponents.tsx:14-15`

- **Music Button Size** (`MusicButton`)
  - Current: `3.5rem × 3.5rem` (56px × 56px)
  - Location: `MusicControlComponent.tsx:11-12`

- **QR Code Size** (in `StartGame.tsx`)
  - Current: `200px` (hardcoded in component)
  - Location: `StartGame.tsx:208`

### Gaps
- **Form Group Gap** (`FormGroup`)
  - Current: `1.5rem` (24px)
  - Location: `FormComponents.tsx:34`

- **Button Container Gap** (`ButtonContainer`)
  - Current: `1rem` (16px)
  - Location: `FormComponents.tsx:152`

- **Player List Gap** (`PlayerList`)
  - Current: `0.75rem` (12px)
  - Location: `GameComponents.tsx:29`

- **Topics Container Gap** (`TopicsContainer`)
  - Current: `0.5rem` (8px)
  - Location: `GameComponents.tsx:59`

- **Options Container Gap** (`OptionsContainer`)
  - Current: `0.75rem` (12px)
  - Location: `OptionsContainer.tsx:7`

- **Big Screen Options Container Gap** (`BigScreenOptionsContainer`)
  - Current: `2rem` (32px) - desktop
  - Responsive: `0.75rem` (12px) - mobile
  - Location: `BigScreenComponents.tsx:79-85`

---

## 🎯 Button Styles

### Button States
- **Hover Effects**
  - All buttons have hover state color changes
  - Option buttons have border color changes on hover
  - Music button has scale transform on hover (`scale(1.05)`)

- **Active Effects**
  - Option buttons have `translateY(1px)` on active
  - Music button has `scale(0.95)` on active

- **Focus Effects**
  - Inputs and buttons have focus ring with `box-shadow`
  - Focus ring color: `rgba(59, 130, 246, 0.1)` or `rgba(59, 130, 246, 0.15)`
  - Focus border color: `#3b82f6` (blue-500)

- **Disabled States**
  - Buttons have gray background when disabled
  - Option buttons have `opacity: 0.6` when disabled
  - Music button has `opacity: 0.5` when disabled

### Button Transitions
- **Base Button Transition** (`Button`)
  - Current: `background-color 0.2s`
  - Location: `FormComponents.tsx:107`

- **Option Button Transition** (`OptionButton`)
  - Current: `background-color 0.15s ease, border-color 0.15s ease, transform 0.05s ease`
  - Location: `OptionsContainer.tsx:26`

- **Music Button Transition** (`MusicButton`)
  - Current: `all 0.2s ease`
  - Location: `MusicControlComponent.tsx:22`

- **Big Screen Option Box Transition** (`BigScreenOptionBox`)
  - Current: `all 0.3s ease`
  - Location: `BigScreenComponents.tsx:100`

- **Tooltip Transition** (`Tooltip`)
  - Current: `opacity 0.2s ease, visibility 0.2s ease`
  - Location: `MusicControlComponent.tsx:68`

---

## 📱 Responsive Design

### Breakpoints
- **Tablet/Mid-size**: `1024px` (used in BigScreenComponents)
- **Mobile**: `768px` (used in BigScreenComponents)
- **Small Mobile**: `420px` (used in OptionsContainer)

### Responsive Elements
- **Big Screen Card**: Adjusts padding and max-width at breakpoints
- **Big Screen Badge**: Adjusts size and font at breakpoints
- **Big Screen Question Text**: Adjusts font size at breakpoints
- **Big Screen Option Box**: Adjusts padding and font size at breakpoints
- **Big Screen Explanation**: Adjusts padding and font size at breakpoints
- **Big Screen Leaderboard**: Adjusts padding and font sizes at breakpoints
- **Options Container**: Switches from 2 columns to 1 column on small screens

---

## 🎭 Special Effects

### Shadows
- **Input Focus Shadow** (`Input`, `AnswerInput`)
  - Current: `0 0 0 3px rgba(59, 130, 246, 0.1)`
  - Locations: `FormComponents.tsx:62`, `GameComponents.tsx:142`

- **Option Button Focus Shadow** (`OptionButton`)
  - Current: `0 0 0 3px rgba(59, 130, 246, 0.15)`
  - Location: `OptionsContainer.tsx:40`

- **Music Button Shadow** (`MusicButton`)
  - Current: `0 4px 6px rgba(0, 0, 0, 0.1)`
  - Location: `MusicControlComponent.tsx:23`

- **Muted Slash Shadow** (`MusicButton` when muted)
  - Current: `0 0 3px rgba(0, 0, 0, 0.5)`
  - Location: `MusicControlComponent.tsx:49`

- **Tooltip Shadow** (`Tooltip`)
  - Current: `0 4px 6px rgba(0, 0, 0, 0.2)`
  - Location: `MusicControlComponent.tsx:65`

### Transforms
- **Music Button Hover** (`MusicButton`)
  - Current: `scale(1.05)`
  - Location: `MusicControlComponent.tsx:28`

- **Music Button Active** (`MusicButton`)
  - Current: `scale(0.95)`
  - Location: `MusicControlComponent.tsx:32`

- **Option Button Active** (`OptionButton`)
  - Current: `translateY(1px)`
  - Location: `OptionsContainer.tsx:34`

- **Muted Slash Transform** (`MusicButton` when muted)
  - Current: `rotate(-45deg)`
  - Location: `MusicControlComponent.tsx:48`

### Opacity
- **Tooltip Opacity** (`Tooltip`)
  - Current: `1` when shown, `0` when hidden
  - Location: `MusicControlComponent.tsx:66`

- **Tooltip Visibility** (`Tooltip`)
  - Current: `visible` when shown, `hidden` when hidden
  - Location: `MusicControlComponent.tsx:67`

---

## 🎨 Layout & Display

### Flexbox & Grid
- **Page Container** (`PageContainer`)
  - Display: `flex`
  - Direction: `column`
  - Align: `center`
  - Justify: `center`

- **Form Card** (`FormCard`)
  - Display: `block` (default)

- **Form Group** (`FormGroup`)
  - Display: `flex`
  - Direction: `column`
  - Gap: `1.5rem`

- **Button Container** (`ButtonContainer`)
  - Display: `flex`
  - Align: `center`
  - Gap: `1rem`

- **Button Container Center** (`ButtonContainerCenter`)
  - Display: `flex`
  - Justify: `center`

- **Player List** (`PlayerList`)
  - Display: `flex`
  - Align: `center`
  - Gap: `0.75rem`

- **Topics Container** (`TopicsContainer`)
  - Display: `flex`
  - Wrap: `wrap`
  - Gap: `0.5rem`
  - Justify: `center`

- **Options Container** (`OptionsContainer`)
  - Display: `grid`
  - Columns: `1fr 1fr` (2 columns)
  - Gap: `0.75rem`
  - Responsive: `1fr` (1 column) on mobile

- **Big Screen Options Container** (`BigScreenOptionsContainer`)
  - Display: `grid`
  - Columns: `1fr 1fr` (2 columns)
  - Gap: `2rem` (desktop), `0.75rem` (mobile)

- **Game Header** (`GameHeader`)
  - Display: `flex`
  - Justify: `space-between`
  - Align: `flex-start`

- **Big Screen Header** (`BigScreenHeader`)
  - Display: `flex`
  - Justify: `space-between`
  - Align: `flex-start`

- **Bottom Section** (`BottomSection`)
  - Display: `flex`
  - Justify: `space-between`
  - Align: `flex-end`

- **Music Control Container** (`MusicControlContainer`)
  - Position: `fixed`
  - Top: `1.5rem`
  - Right: `1.5rem`
  - Z-index: `1000`

---

## 🔧 Global CSS Variables

### CSS Custom Properties (in `globals.css`)
- **--background**: `#ffffff` (light mode), `#0a0a0a` (dark mode)
- **--foreground**: `#171717` (light mode), `#ededed` (dark mode)
- **--color-background**: Uses `--background`
- **--color-foreground**: Uses `--foreground`
- **--font-sans**: Uses `--font-geist-sans`
- **--font-mono**: Uses `--font-geist-mono`
- **--font-shadows-into-light**: Uses `--font-shadows-into-light`

---

## 📝 Quick Reference: Component File Locations

| Component Category | File Path |
|-------------------|-----------|
| Forms & Buttons | `frontend/components/styled/FormComponents.tsx` |
| Game Elements | `frontend/components/styled/GameComponents.tsx` |
| Big Screen Display | `frontend/components/styled/BigScreenComponents.tsx` |
| Error Messages | `frontend/components/styled/ErrorComponents.tsx` |
| Info Boxes | `frontend/components/styled/InfoComponents.tsx` |
| Status Messages | `frontend/components/styled/StatusComponents.tsx` |
| Music Control | `frontend/components/styled/MusicControlComponent.tsx` |
| Option Buttons | `frontend/components/styled/OptionsContainer.tsx` |
| Global Styles | `app/globals.css` |

---

## 💡 Tips for Customization

1. **Color Scheme**: To change the overall color scheme, modify the color values in the styled component files. Consider creating a theme file with color constants for consistency.

2. **Typography**: To change fonts globally, modify `body` font-family in `globals.css` or create a theme with font variables.

3. **Spacing**: The spacing system uses rem units. To change the base spacing scale, modify the rem values throughout the components.

4. **Responsive Design**: Breakpoints are defined in media queries. Adjust these values in `BigScreenComponents.tsx` and `OptionsContainer.tsx` to change when responsive styles kick in.

5. **Consistency**: When customizing, maintain consistency across similar components (e.g., all buttons should have similar styling patterns).

6. **Accessibility**: When changing colors, ensure sufficient contrast ratios for text readability (WCAG AA standard: 4.5:1 for normal text, 3:1 for large text).

---

## 🎯 Summary of Customizable Elements

✅ **Colors**: Backgrounds, text, borders, buttons, badges, errors, success messages  
✅ **Fonts**: Family, size, weight  
✅ **Spacing**: Padding, margins, gaps  
✅ **Borders**: Width, color, radius  
✅ **Sizes**: Widths, heights, max-widths  
✅ **Effects**: Shadows, transitions, transforms, hover states  
✅ **Layout**: Flexbox, grid, positioning  
✅ **Responsive**: Breakpoints, media queries  
✅ **States**: Hover, active, focus, disabled  

All of these can be customized by editing the styled-components files listed above!
