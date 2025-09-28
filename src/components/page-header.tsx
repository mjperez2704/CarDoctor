import * as React from "react";

type PageHeaderProps = {
    title: string;
    description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-primary px-4 sm:px-6 mb-4 rounded-lg shadow-md">
            <div className="flex flex-col">
                <h1 className="text-xl font-semibold text-primary-foreground">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-primary-foreground/80">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
