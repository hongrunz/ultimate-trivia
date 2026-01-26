# Theme Variables Usage Examples

This file shows how to use the color theme variables in your styled components.

## Basic Import Pattern

```typescript
import styled from 'styled-components';
import { colors } from './theme';

// Example 1: Using primary color
export const MyComponent = styled.div`
  background-color: ${colors.primary};
  border: 2px solid ${colors.border};
  color: ${colors.typeMain};
`;

// Example 2: Using surface colors
export const Card = styled.div`
  background-color: ${colors.surface};
  border: 1px solid ${colors.border};
`;

// Example 3: Using secondary surface with opacity
export const Overlay = styled.div`
  background-color: ${colors.surfaceSecondary};
`;

// Example 4: Using accent colors
export const HighlightButton = styled.button`
  background-color: ${colors.accent};
  color: ${colors.typeMain};
  
  &:hover {
    background-color: ${colors.typeAccent};
  }
`;

// Example 5: Using selected state
export const SelectableItem = styled.div<{ $isSelected?: boolean }>`
  background-color: ${props => props.$isSelected ? colors.primarySelected : colors.surface};
  color: ${props => props.$isSelected ? colors.surface : colors.typeMain};
`;
```

## Complete Component Example

Here's a complete example showing how to migrate an existing component:

### Before (hardcoded colors):
```typescript
export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #d1d5db;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const FormCard = styled.div`
  background-color: #e5e7eb;
  border: 2px solid #000000;
  border-radius: 0;
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #000000;
  text-align: center;
  margin-bottom: 2rem;
`;
```

### After (using theme variables):
```typescript
import styled from 'styled-components';
import { colors } from './theme';

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export const FormCard = styled.div`
  background-color: ${colors.surface};
  border: 2px solid ${colors.border};
  border-radius: 0;
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.typeMain};
  text-align: center;
  margin-bottom: 2rem;
`;
```

## Color Mapping Suggestions

When migrating existing components, consider these mappings:

| Old Color | New Theme Variable | Use Case |
|-----------|-------------------|----------|
| `#d1d5db` (light gray) | `colors.primary` | Page backgrounds |
| `#e5e7eb` (light gray) | `colors.surface` | Card backgrounds |
| `#000000` (black) | `colors.typeMain` | Main text |
| `#ffffff` (white) | `colors.surface` | White surfaces |
| `#3b82f6` (blue-500) | `colors.accent` | Primary actions |
| `#9ca3af` (gray-400) | `colors.border` | Secondary text/borders |
| `#4b5563` (gray-600) | `colors.bgContrast` | Dark backgrounds |
| `#16a34a` (green-600) | keep green | Success states |
| `#dc2626` (red-600) | Keep red  | Error states |

## Conditional Styling with Theme

```typescript
import styled from 'styled-components';
import { colors } from './theme';

// Example: Conditional background based on variant
export const InfoBox = styled.div<{ $variant?: 'web' | 'mobile' }>`
  background-color: ${props => 
    props.$variant === 'web' 
      ? colors.primary 
      : colors.accent
  };
  border: 2px solid ${colors.border};
  color: ${colors.typeMain};
`;

// Example: Hover states
export const Button = styled.button`
  background-color: ${colors.primary};
  color: ${colors.surface};
  border: 2px solid ${colors.border};
  
  &:hover:not(:disabled) {
    background-color: ${colors.primarySelected};
  }
  
  &:disabled {
    background-color: ${colors.typeSecondary};
    opacity: 0.5;
  }
`;

// Example: Focus states
export const Input = styled.input`
  border: 1px solid ${colors.border};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.surfaceSecondary};
  }
`;
```

## Using Legacy Colors

The theme file also includes legacy color scales for backward compatibility:

```typescript
import { colors } from './theme';

// Gray scale
background-color: ${colors.gray[100]};
color: ${colors.gray[800]};

// Blue scale
border-color: ${colors.blue[500]};
background-color: ${colors.blue[600]};

// Green for success
color: ${colors.green[600]};

// Red for errors
color: ${colors.red[600]};
```

## Tips

1. **Import once per file**: Import `colors` at the top of each styled component file
2. **Use semantic names**: Prefer `colors.primary` over `colors.blue[500]` for better maintainability
3. **Keep legacy colors**: Use legacy color scales (gray, blue, etc.) only when the new theme doesn't fit
4. **Update gradually**: You don't need to update all components at once - migrate incrementally
5. **Test changes**: After updating colors, test all components to ensure proper contrast and visibility
