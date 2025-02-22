export default function formatDate(createdAt: Date) {
    const formattedDateTime = new Date(
        createdAt.getFullYear(),
        createdAt.getMonth(),
        createdAt.getDay(),
        createdAt.getHours(),
        createdAt.getMinutes()
    );

    return formattedDateTime;
}