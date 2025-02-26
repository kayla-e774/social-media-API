export default function formatDate(createdAt: Date) {
    const formattedDateTime = createdAt.toLocaleString();

    return formattedDateTime;
}