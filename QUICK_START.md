# JO.FRA.DEL. Quick Start Guide

## 🚀 Getting Started

### Step 1: Verify Installation

The project has been created with all necessary dependencies installed:

```bash
cd f:\Anbu\Github_Repository\JO_FRA_DEL\jo_fra_del
npm list | grep -E "(angular|three|gsap|bootstrap)"
```

### Step 2: Start Development Server

```bash
npm start
```

- App will be available at `http://localhost:4200`
- Automatic reload on file changes
- Console shows any errors/warnings

### Step 3: Explore the Application

#### Landing Page (/)

- See main JO.FRA.DEL. introduction
- Browse venture cards
- Navigate using top menu

#### Tech & Training (/tech_and_training)

- View 6 professional courses
- Read student reviews
- See training statistics

#### Stonecrust Atelier (/stonecrust_atelier)

- Browse premium bakery products
- Learn about artisan process
- See visit information

## 📝 Project Customization

### Update Content

#### Change Organization Info (Landing Page)

File: `src/app/modules/home/home.component.ts`

```typescript
// Update dummy text and statistics
ventures: Venture[] = [ /* ... */ ]
```

#### Update Courses

File: `src/app/modules/tech-training/tech-training.component.ts`

```typescript
courses: Course[] = [
  {
    id: 'angular',
    name: 'ANGULAR',
    // Update course details here
  },
  // Add more courses
]
```

#### Update Bakery Products

File: `src/app/modules/stonecrust-atelier/stonecrust-atelier.component.ts`

```typescript
products: Product[] = [
  {
    id: 'artisan-bread',
    name: 'Artisan Breads',
    // Update product details
  },
  // Add more products
]
```

### Update Styles

#### Change Colors

File: `src/app/variables.scss`

```scss
$primary-black: #0a0e27; // Change main background
$accent-gold: #d4af37; // Change primary accent
$light-gold: #f4d03f; // Change secondary accent
```

#### Update Global Styles

File: `src/styles.scss`

- Modify animations
- Adjust typography
- Update responsive breakpoints

## 🎨 Design System

### Color Variables Available

- `$primary-black` - Main background
- `$secondary-black` - Secondary elements
- `$accent-gold` - Primary highlight
- `$light-gold` - Secondary highlight
- `$text-light` - Main text color
- `$text-muted` - Secondary text color

### CSS Utility Classes

```html
<div class="text-gold">Gold text</div>
<div class="text-light-gold">Light gold text</div>
<div class="bg-gold">Gold background</div>
<div class="border-gold">Gold border</div>
```

## 🔄 Adding New Ventures

### Step 1: Create New Module

```bash
ng generate module modules/new-venture --routing
```

### Step 2: Create Component

```bash
ng generate component modules/new-venture/new-venture
```

### Step 3: Update App Routing

File: `src/app/app-routing.module.ts`

```typescript
const routes: Routes = [
  // ... existing routes
  {
    path: "new_venture",
    loadChildren: () => import("./modules/new-venture/new-venture.module").then((m) => m.NewVentureModule),
  },
];
```

### Step 4: Add to Home Page Ventures

File: `src/app/modules/home/home.component.ts`

```typescript
ventures: Venture[] = [
  // ... existing ventures
  {
    id: 'new-venture',
    name: 'JO.FRA.DEL. NEW VENTURE NAME',
    shortName: 'New Venture',
    description: 'Description of your new venture',
    icon: '🎯',
    route: 'new_venture',
    color: '#your-color'
  }
];
```

## 📦 Build & Deploy

### Development Build

```bash
npm start
```

### Production Build

```bash
npm run build
```

Output will be in `dist/jo_fra_del/`

### Test Build Locally

```bash
cd dist/jo_fra_del
python -m http.server 8000
# Visit http://localhost:8000
```

## 🐛 Troubleshooting

### Port 4200 Already in Use

```bash
# Use different port
ng serve --port 4201
```

### Clear Cache

```bash
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

### Build Issues

```bash
# Clean build
ng build --verbose
```

### CSS Issues

```bash
# Check Bootstrap is imported in styles.scss
@import '~bootstrap/scss/bootstrap';
```

## 📱 Testing Responsive Design

### Using Chrome DevTools

1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Test different screen sizes

### Common Breakpoints to Test

- **Mobile**: 375px (iPhone SE)
- **Mobile**: 768px (iPad)
- **Tablet**: 1024px (iPad Pro)
- **Desktop**: 1920px (Full HD)

## ✅ Pre-Deployment Checklist

- [ ] All content updated with actual text
- [ ] Images optimized and in place
- [ ] Links verified working
- [ ] Mobile responsiveness tested
- [ ] Browser compatibility checked
- [ ] Analytics configured
- [ ] SEO meta tags added
- [ ] Environment variables set
- [ ] Production build tested

## 📊 Project Statistics

- **Total Components**: 7 (Navbar, Footer, Home, Tech-Training, Stonecrust, 2 Routing)
- **Modules**: 4 (Shared, Home, Tech-Training, Stonecrust)
- **Routes**: 3 (/, /tech_and_training, /stonecrust_atelier)
- **Lines of Code**: ~2500+
- **Styling**: SCSS with variables

## 🎓 Learning Resources

### Angular Documentation

- [Angular Official Docs](https://angular.io/docs)
- [Angular CLI](https://angular.io/cli)
- [Angular Material](https://material.angular.io)

### CSS & Design

- [SCSS Documentation](https://sass-lang.com/documentation)
- [Bootstrap Documentation](https://getbootstrap.com/docs)
- [GSAP Animation](https://gsap.com/docs)

### Tools

- [Visual Studio Code](https://code.visualstudio.com/)
- [Angular DevTools Extension](https://angular.io/guide/devtools)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

## 📞 Support

For issues or questions:

1. Check the [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) for detailed info
2. Review component TypeScript files for logic
3. Check SCSS files for styling questions
4. Consult Angular official documentation

---

**Happy Development! 🎉**
