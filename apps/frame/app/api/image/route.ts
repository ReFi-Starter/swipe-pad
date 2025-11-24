import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const category = searchParams.get('category');
    
    if (!projectId || !category) {
      return new NextResponse('Missing required parameters', { status: 400 });
    }
    
    // Get project data
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
      
    if (error || !project) {
      return new NextResponse('Project not found', { status: 404 });
    }
    
    // Get user profile data if available
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wallet_address', project.wallet)
      .single();
    
    // Get active boosts for this project
    const { data: boosts } = await supabase
      .from('boosts')
      .select('*')
      .eq('project_id', projectId)
      .eq('active', true)
      .gt('expires_at', new Date().toISOString())
      .order('amount_usd', { ascending: false });
    
    // Determine badge color based on category
    let badgeColor = '#3B82F6'; // Default blue
    if (category === 'builders') badgeColor = '#10B981'; // Green
    if (category === 'karmahq') badgeColor = '#F59E0B'; // Yellow
    if (category === 'ecocerts') badgeColor = '#8B5CF6'; // Purple
    
    // Generate image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#1A1A1A',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {/* Header with category badge */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px',
              borderBottom: '1px solid #333',
            }}
          >
            <div
              style={{
                backgroundColor: badgeColor,
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {userProfile?.is_verified && (
                <div
                  style={{
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ✓ Verified
                </div>
              )}
              {boosts && boosts.length > 0 && (
                <div
                  style={{
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  ⚡ Boosted
                </div>
              )}
            </div>
          </div>
          
          {/* Project image */}
          <div
            style={{
              height: '200px',
              backgroundImage: `url(${project.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Project details */}
          <div
            style={{
              padding: '16px',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                {project.name}
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  margin: '0 0 16px 0',
                  color: '#CCC',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {project.description}
              </p>
            </div>
            
            {/* Call to action */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  color: '#AAA',
                }}
              >
                {project.wallet.substring(0, 6)}...{project.wallet.substring(project.wallet.length - 4)}
              </div>
              <div
                style={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                Swipe Right to Donate
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 800,
        height: 418,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
