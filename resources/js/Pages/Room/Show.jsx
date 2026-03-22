import { lazy, Suspense } from 'react';

const ShowPage = lazy(() => import('./ShowPage'));

export default function Show(props) {
    return (
        <Suspense
            fallback={
                <div className="theme-page flex min-h-screen items-center justify-center px-6 py-12">
                    <div className="theme-card px-6 py-4 text-sm text-theme-secondary">
                        Loading room...
                    </div>
                </div>
            }
        >
            <ShowPage {...props} />
        </Suspense>
    );
}
