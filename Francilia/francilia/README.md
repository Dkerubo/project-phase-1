# Francilia Films - AI-Powered Streaming Platform

A Netflix-style streaming platform with integrated AI features for personalized recommendations and customer support.

## 🤖 AI Features

### 1. AI Chat Assistant
- **24/7 Support**: Instant help with account, technical, and content questions
- **Smart Responses**: Context-aware responses for better user experience
- **Quick Actions**: Pre-built shortcuts for common requests
- **Multi-language Support**: Responds in user's preferred language

### 2. AI Recommendations Engine
- **Personalized Suggestions**: Based on viewing history and preferences
- **Smart Categorization**: Trending, Similar, New content categories
- **Confidence Scoring**: Shows how well content matches user preferences
- **Real-time Updates**: Recommendations improve as users watch more content

### 3. Smart Search & Discovery
- **Natural Language Search**: "Find me a funny movie with Ryan Reynolds"
- **Genre Intelligence**: Understands mood and context
- **Content Analysis**: AI analyzes user behavior patterns

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account (for user management)
- OpenAI API key (optional - falls back to mock responses)

### Environment Variables
Create a `.env.local` file with:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI (Optional - AI will use mock responses without this)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# Muvi API (Optional - uses mock data without this)
NEXT_PUBLIC_MUVI_API_KEY=your_muvi_api_key
```

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration file in `supabase/migrations/`
   - Update environment variables

3. **Configure OpenAI (Optional)**
   - Get API key from OpenAI
   - Add to environment variables
   - Without this, AI uses intelligent mock responses

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🎯 AI Configuration

### OpenAI Setup (Recommended)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get API key
3. Add `NEXT_PUBLIC_OPENAI_API_KEY` to your environment
4. AI chat will use GPT-3.5-turbo for responses

### Mock Mode (Default)
- AI works without OpenAI API key
- Uses intelligent pattern matching
- Provides contextual responses
- Perfect for development and testing

## 🔧 AI Customization

### Chat Assistant
- Modify system prompt in `lib/ai-service.ts`
- Add new quick actions in `components/ui/ai-chat.tsx`
- Customize response patterns for mock mode

### Recommendations Engine
- Adjust scoring algorithm in `generateRecommendations()`
- Add new recommendation categories
- Modify confidence calculation logic

### Smart Search
- Enhance search patterns in `smartSearch()`
- Add new content analysis features
- Integrate with external APIs

## 📱 Features

### User Features
- **Streaming**: High-quality video playback
- **Personalization**: AI-powered recommendations
- **Multi-device**: Watch on any device
- **Offline**: Download for offline viewing
- **Profiles**: Multiple user profiles per account

### Admin Features
- **Content Management**: Add, edit, delete movies
- **User Analytics**: View user behavior and preferences
- **AI Insights**: See recommendation performance
- **System Health**: Monitor AI service status

### AI Features
- **Chat Support**: 24/7 AI assistant
- **Smart Recommendations**: Personalized content discovery
- **Behavioral Analysis**: Understanding user preferences
- **Predictive Analytics**: Content performance prediction

## 🎨 Design Philosophy

- **Netflix-inspired**: Familiar, intuitive interface
- **AI-first**: AI features seamlessly integrated
- **Mobile-responsive**: Works perfectly on all devices
- **Accessibility**: WCAG compliant design
- **Performance**: Optimized for speed and efficiency

## 🔒 Security & Privacy

- **Data Protection**: User data encrypted and secure
- **Privacy-first**: AI recommendations use anonymized data
- **Secure Authentication**: Supabase Auth integration
- **Device Management**: Track and manage user devices

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Other Platforms
- Works with any Node.js hosting
- Ensure environment variables are set
- Build with `npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test AI features thoroughly
5. Submit pull request

## 📞 Support

- **AI Chat**: Use the built-in AI assistant
- **Documentation**: Check this README
- **Issues**: Create GitHub issue
- **Email**: Contact development team

## 🎯 Roadmap

### Phase 1 ✅
- [x] AI Chat Assistant
- [x] Basic Recommendations
- [x] Smart Search

### Phase 2 🚧
- [ ] Voice Commands
- [ ] Advanced Analytics
- [ ] Content Generation

### Phase 3 📋
- [ ] Predictive Caching
- [ ] AI-generated Trailers
- [ ] Emotion-based Recommendations

---

**Powered by AI** 🤖 | **Built with Next.js** ⚡ | **Styled with Tailwind** 🎨