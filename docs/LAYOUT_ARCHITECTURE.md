# SwipePad Layout Architecture

## Overview

SwipePad follows a hierarchical layout structure that ensures consistent spacing, responsive behavior, and proper layering across different screen sizes and devices. This document outlines the core layout principles and component hierarchy.

## Layout Hierarchy

```
AppShell (fixed)
├── TopBar (fixed)
├── Content Layout (dynamic)
│   ├── Swipe View
│   │   ├── TabSwitcher (fixed)
│   │   ├── CategorySelector (fixed)
│   │   ├── Cards Stack (dynamic)
│   │   └── ActionBar (fixed)
│   ├── Social View
│   ├── Create/Status View
│   └── Profile View
├── BottomBar (fixed)
└── Overlay Layer (portal)
    ├── Onboarding
    ├── Drawers
    ├── Animations/Emojis
    ├── Popups/Tooltips
    └── Toasts
```

## 1. App Shell Layout

The App Shell serves as the primary container and maintains consistent spacing across all views.

### Characteristics:
- Fixed height and width (100vw/vh)
- Contains TopBar and BottomBar
- Responsive height adjustments for different devices
- All content is contained within its bounds (except overlay layer)

### Example Implementation:
```tsx
<div className="flex flex-col h-screen">
  <TopBar className="flex-none" />
  <main className="flex-1 relative overflow-hidden">
    {children}
  </main>
  <BottomBar className="flex-none" />
</div>
```

## 2. Content Layout

The Content Layout is the dynamic area between the TopBar and BottomBar.

### Characteristics:
- Dynamically extends to available height
- Respects App Shell margins
- Scrollable when content exceeds available space
- Contains view-specific layouts (Swipe, Social, Create/Status, Profile)

### Example Implementation:
```tsx
<div className="flex-1 overflow-auto">
  <div className="h-full relative">
    {currentView}
  </div>
</div>
```

## 3. Swipe View Layout

The Swipe View demonstrates how a specific view should be structured within the Content Layout.

### Characteristics:
- Fixed TabSwitcher at top
- Fixed CategorySelector below TabSwitcher
- Dynamic Cards Stack area
- Fixed ActionBar at bottom
- Maintains consistent spacing with App Shell

### Example Implementation:
```tsx
<div className="flex flex-col h-full">
  <TabSwitcher className="flex-none" />
  <CategorySelector className="flex-none" />
  <div className="flex-1 relative">
    <CardsStack />
  </div>
  <ActionBar className="flex-none" />
</div>
```

## Overlay Layer

The Overlay Layer handles all elements that need to appear above the main content.

### Characteristics:
- Rendered via React Portal
- Maintains proper z-index hierarchy
- Contained within App Shell bounds
- Handles interactive elements (drawers, tooltips)

### Z-Index Hierarchy:
```css
:root {
  --z-base: 0;
  --z-content: 10;
  --z-navigation: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-toast: 50;
}
```

## Responsive Behavior

### Height-Based Adjustments:
- App Shell margins/padding adjust based on viewport height
- Content areas flex to fill available space
- Text and element sizes scale appropriately
- Maintains consistent spacing ratios

### Width-Based Adjustments:
- Content maintains max-width for readability
- Elements reflow based on available width
- Maintains consistent center alignment
- Preserves touch target sizes

## Best Practices

1. **Relative Positioning**
   - Use flex layouts instead of absolute positioning
   - Maintain natural document flow
   - Use relative units (rem, em, %) over fixed units

2. **Container Queries**
   - Components should respond to their container
   - Use container queries for more granular control
   - Maintain consistent spacing ratios

3. **Height Management**
   - Use flex-grow and flex-shrink appropriately
   - Handle overflow consistently
   - Maintain fixed elements without breaking layout

4. **Spacing System**
   - Use consistent spacing scale
   - Maintain vertical rhythm
   - Scale spacing based on viewport size

## Implementation Guidelines

### Layout Components:
```tsx
// Base layout component
const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    {children}
  </div>
);

// Content layout component
const ContentLayout = ({ children }) => (
  <div className="flex-1 container mx-auto px-4">
    {children}
  </div>
);

// View layout component
const ViewLayout = ({ children }) => (
  <div className="flex flex-col h-full gap-4">
    {children}
  </div>
);
```

### Usage:
```tsx
<Layout>
  <TopBar />
  <ContentLayout>
    <ViewLayout>
      {/* View-specific content */}
    </ViewLayout>
  </ContentLayout>
  <BottomBar />
</Layout>
```

## Future Improvements

1. **Simplification Opportunities**:
   - Consider component composition over inheritance
   - Implement smart defaults for common patterns
   - Create reusable layout primitives

2. **Performance Optimizations**:
   - Virtualize long lists
   - Lazy load off-screen content
   - Optimize animations for 60fps

3. **Accessibility Enhancements**:
   - Ensure proper focus management
   - Maintain consistent navigation patterns
   - Support screen reader announcements

## Conclusion

This layout architecture provides a solid foundation for building responsive and maintainable user interfaces. By following these patterns, we ensure consistency across the application while maintaining flexibility for future enhancements. 