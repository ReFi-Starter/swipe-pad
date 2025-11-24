// Cursor prompt: "Create a Farcaster Frame API route for SwipePad"

import { getFrameMessage } from '@farcaster/frame-sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  try {
    // Get frame message using Farcaster Frame SDK
    const frameMessage = await getFrameMessage(req);
    
    // Get user address from the message
    const userAddress = frameMessage.interactor.verified_accounts?.[0] || '';
    
    // Get state from the message
    const state = frameMessage.state || {};
    const currentProjectIndex = state.projectIndex || 0;
    const category = state.category || 'builders';
    
    // Get button index
    const buttonIndex = frameMessage.buttonIndex || 0;
    
    // Handle different button actions
    if (buttonIndex === 1) {
      // Swipe right (donate)
      return handleDonate(currentProjectIndex, category, userAddress);
    } else if (buttonIndex === 2) {
      // Swipe left (skip)
      return handleSkip(currentProjectIndex, category);
    } else if (buttonIndex === 3) {
      // Boost project
      return handleBoost(currentProjectIndex, category);
    } else if (buttonIndex === 4) {
      // Switch category
      return handleCategorySwitch(category);
    }
    
    // Default: show first project
    return await showProject(0, category);
  } catch (error) {
    console.error('Error in frame API:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function handleDonate(projectIndex: number, category: string, userAddress: string) {
  // Get current project
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
    .range(projectIndex, projectIndex)
    .single();
    
  if (error || !project) {
    return new NextResponse('Project not found', { status: 404 });
  }
  
  // Create a donation frame
  const imageUrl = `${process.env.NEXT_PUBLIC_FRAME_URL}/api/donate-image?projectId=${project.id}&category=${category}`;
  
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SwipePad - Donate to ${project.name}</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:button:1" content="Donate 1 cUSD" />
        <meta property="fc:frame:button:2" content="Donate 5 cUSD" />
        <meta property="fc:frame:button:3" content="Donate 10 cUSD" />
        <meta property="fc:frame:button:4" content="Back" />
        <meta property="fc:frame:state" content="${JSON.stringify({
          projectId: project.id,
          category,
          action: 'donate'
        })}" />
      </head>
      <body>
        <h1>Donate to ${project.name}</h1>
      </body>
    </html>
  `);
}

async function handleSkip(projectIndex: number, category: string) {
  // Show next project
  return await showProject(projectIndex + 1, category);
}

async function handleBoost(projectIndex: number, category: string) {
  // Get current project
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })
    .range(projectIndex, projectIndex)
    .single();
    
  if (error || !project) {
    return new NextResponse('Project not found', { status: 404 });
  }
  
  // Create a boost frame
  const imageUrl = `${process.env.NEXT_PUBLIC_FRAME_URL}/api/boost-image?projectId=${project.id}&category=${category}`;
  
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SwipePad - Boost ${project.name}</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:button:1" content="Boost 5 cUSD (1 day)" />
        <meta property="fc:frame:button:2" content="Boost 10 cUSD (3 days)" />
        <meta property="fc:frame:button:3" content="Boost 20 cUSD (7 days)" />
        <meta property="fc:frame:button:4" content="Back" />
        <meta property="fc:frame:state" content="${JSON.stringify({
          projectId: project.id,
          category,
          action: 'boost'
        })}" />
      </head>
      <body>
        <h1>Boost ${project.name}</h1>
      </body>
    </html>
  `);
}

async function handleCategorySwitch(currentCategory: string) {
  // Determine next category
  const categories = ['builders', 'karmahq', 'ecocerts'];
  const currentIndex = categories.indexOf(currentCategory);
  const nextCategory = categories[(currentIndex + 1) % categories.length];
  
  // Show first project in next category
  return await showProject(0, nextCategory);
}

async function showProject(projectIndex: number, category: string) {
  // Get shuffled deck with boosts
  const { data: projects, error } = await supabase.rpc('get_shuffled_deck', {
    p_category: category,
    p_user_address: '0x0000000000000000000000000000000000000000000' // Use placeholder for now
  });
  
  if (error || !projects || projects.length === 0 || projectIndex >= projects.length) {
    return new NextResponse('No projects found', { status: 404 });
  }
  
  const project = projects[projectIndex];
  
  // Create image URL for project card
  const imageUrl = `${process.env.NEXT_PUBLIC_FRAME_URL}/api/image?projectId=${project.id}&category=${category}`;
  
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SwipePad - ${project.name}</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${imageUrl}" />
        <meta property="fc:frame:button:1" content="Swipe Right (Donate)" />
        <meta property="fc:frame:button:2" content="Swipe Left (Skip)" />
        <meta property="fc:frame:button:3" content="Boost Project" />
        <meta property="fc:frame:button:4" content="Switch Category (${category})" />
        <meta property="fc:frame:state" content="${JSON.stringify({
          projectIndex,
          category
        })}" />
      </head>
      <body>
        <h1>${project.name}</h1>
      </body>
    </html>
  `);
}