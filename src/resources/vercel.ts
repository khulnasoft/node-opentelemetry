import {
    DetectorSync,
    Resource,
    ResourceDetectionConfig,
} from '@opentelemetry/resources';
import {
    SemanticResourceAttributes,
} from '@opentelemetry/semantic-conventions';

export class VercelDetector implements DetectorSync {
    detect(_config?: ResourceDetectionConfig): Resource {
        if (!process.env.VERCEL) {
            return Resource.empty();
        }

        const deploymentUrl = String(process.env.VERCEL_URL);

        if (!deploymentUrl) {
            return Resource.empty();
        }

       
        const attributes = {
            [SemanticResourceAttributes.CLOUD_PROVIDER]: String(
                'Vercel'
            ),
            [SemanticResourceAttributes.CLOUD_PLATFORM]: String(
                'Vercel Functions'
            ),
            [SemanticResourceAttributes.CLOUD_REGION]: String(process.env.VERCEL_REGION),
            'vercel.environment': String(process.env.VERCEL_ENV),
            'vercel.url': String(process.env.VERCEL_URL),
            'vercel.git.provider': String(process.env.VERCEL_GIT_PROVIDER),
            'vercel.git.repo': String(process.env.VERCEL_GIT_REPO_SLUG),
            'vercel.git.commit': String(process.env.VERCEL_GIT_COMMIT_SHA),
            'vercel.git.message': String(process.env.VERCEL_GIT_COMMIT_MESSAGE),
            'vercel.git.author': String(process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME)
        }

        const gitBranchUrl = String(process.env.VERCEL_BRANCH_URL);
        
        if(gitBranchUrl) {
            try { 
                let serviceName = gitBranchUrl.split('-git-')[0]
                attributes['service.name'] = serviceName;
                attributes['service.namespace'] = serviceName;
            } catch(e) {
            }
        }
        return new Resource(attributes);
    }
}
