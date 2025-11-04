
# Running Daily Skill Log Locally

As your co-founder, I'm excited for you to run our complete platform. Follow these steps precisely to set up your Supabase backend and launch the web application.

### **Step 1: Download and Prepare the Code**

1.  Download all the files provided.
2.  Create a new folder on your computer named `skill-log-app`.
3.  Place all the downloaded files and folders inside `skill-log-app`. Your structure should look like this:
    ```
    skill-log-app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── pages/
    ├── supabase/
    ├── App.tsx
    ├── index.html
    ├── index.tsx
    └── ...and so on
    ```

### **Step 2: Set Up Your Supabase Database**

This is the most critical step. We need to create the database tables that our application relies on.

1.  Go to your Supabase Project Dashboard: [https://supabase.com/dashboard/project/qccdgjdrrdyneriqjijf](https://supabase.com/dashboard/project/qccdgjdrrdyneriqjijf)
2.  In the left sidebar, click the **SQL Editor** icon.
3.  Click **"+ New query"**.
4.  Copy the entire SQL script below and paste it into the SQL Editor.
5.  **Important:** You must run this entire script as a single query. Do not run the statements one by one.
6.  Click the **"RUN"** button. This will create all the necessary tables, relationships, and security policies.

```sql
-- 1. Create user roles enum
CREATE TYPE user_role AS ENUM ('developer', 'recruiter');

-- 2. Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  display_name TEXT UNIQUE,
  reputation INT DEFAULT 0,
  is_open_to_work BOOLEAN DEFAULT false,
  spotlight_summary TEXT,
  role user_role NOT NULL DEFAULT 'developer'
);
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Policies for profiles
CREATE POLICY "Users can view all profiles." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Create learning_logs table
CREATE TABLE learning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  text TEXT NOT NULL,
  tags TEXT[],
  mood TEXT,
  image_url TEXT,
  is_public BOOLEAN DEFAULT true,
  upvotes INT DEFAULT 0,
  github_url TEXT,
  live_url TEXT
);
-- Enable RLS
ALTER TABLE learning_logs ENABLE ROW LEVEL SECURITY;
-- Policies for learning_logs
CREATE POLICY "Users can view all public logs." ON learning_logs FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own private logs." ON learning_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own logs." ON learning_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own logs." ON learning_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own logs." ON learning_logs FOR DELETE USING (auth.uid() = user_id);

-- 4. Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id UUID REFERENCES learning_logs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  upvotes INT DEFAULT 0
);
-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
-- Policies for comments
CREATE POLICY "Users can view all comments." ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own comments." ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments." ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments." ON comments FOR DELETE USING (auth.uid() = user_id);

-- 5. Create circles table
CREATE TABLE circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
-- Policies for circles
CREATE POLICY "Users can view all public circles." ON circles FOR SELECT USING (is_private = false);

-- 6. Create circle_messages table
CREATE TABLE circle_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE circle_messages ENABLE ROW LEVEL SECURITY;
-- Policies for circle_messages
CREATE POLICY "Users can view all circle messages." ON circle_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert their own circle messages." ON circle_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. Create outreach_messages table
CREATE TABLE outreach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE outreach_messages ENABLE ROW LEVEL SECURITY;
-- Policies for outreach_messages
CREATE POLICY "Developers can view messages sent to them." ON outreach_messages FOR SELECT USING (auth.uid() = developer_id);
CREATE POLICY "Recruiters can insert messages." ON outreach_messages FOR INSERT WITH CHECK (auth.uid() = recruiter_id);

-- 8. Create a function to automatically create a profile when a new user signs up
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, display_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'full_name', 'developer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create a trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. Create Storage Bucket for screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('learning-screenshots', 'learning-screenshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "User can upload to their own folder"
ON storage.objects FOR INSERT
WITH CHECK ( auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "User can view their own folder"
ON storage.objects FOR SELECT
USING ( auth.uid()::text = (storage.foldername(name))[1] );
```

### **Step 3: Deploy Backend Edge Functions**

Our app's AI and Reputation features are powered by secure backend functions. You need to deploy them using the Supabase CLI.

1.  **Install the Supabase CLI:** If you don't have it, open your terminal and run:
    ```bash
    npm install supabase --save-dev
    ```

2.  **Log in to Supabase:**
    ```bash
    npx supabase login
    ```
    Follow the prompts to log in with your Supabase account.

3.  **Link Your Project:** Navigate to your `skill-log-app` folder in the terminal and run:
    ```bash
    npx supabase link --project-ref qccdgjdrrdyneriqjijf
    ```
    This links your local folder to your Supabase project.

4.  **Set the Gemini API Secret:** This is critical. Run this command in your terminal, replacing the key with the one you have:
    ```bash
    npx supabase secrets set GEMINI_API_KEY=AIzaSyC3XwQbitJnKkupsCfntSdgb7JIQX97mHc
    ```

5.  **Deploy the Functions:** Run this final command to deploy all the backend functions:
    ```bash
    npx supabase functions deploy
    ```
    This will deploy `generate-synthesis-report`, `get-chatbot-response`, `update-profile`, and the other functions.

### **Step 4: Run the Web Application**

Now that the backend is live, you can run the frontend.

1.  **Open a new terminal** and navigate to your `skill-log-app` folder.
2.  You need a simple local web server. The easiest way is to use `npx serve`. Run this command:
    ```bash
    npx serve
    ```
3.  The terminal will output a local address, usually `http://localhost:3000`.

### **Step 5: You're Live!**

Open your web browser and navigate to the address from the previous step (e.g., `http://localhost:3000`).

The application is now fully functional and connected to your live Supabase backend. You can create a developer account, post logs, and then create a separate recruiter account to see the B2B side of the platform.

Welcome to the future of professional development.
