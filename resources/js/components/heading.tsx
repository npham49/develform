export default function Heading({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-4 d-flex flex-column gap-1">
            <h2 className="fs-4 fw-semibold">{title}</h2>
            {description && <p className="small text-muted">{description}</p>}
        </div>
    );
}
