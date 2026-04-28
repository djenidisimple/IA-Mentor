"use client";
export default function InfoCommunityPage({slug}: {slug: string[]}) {
    
    return (
        <div>
            <h1>Info Community Page</h1>
            <p>Slug: {slug.join("/")}</p>
        </div>
    )
}