interface ScrollData {
    id: string;
    title: string;
    image: string;
    description: string;
}

export const MOCK_DATA: ScrollData[] = [
    {
        id: "1",
        title: "Mountain Adventure",
        image: "/images/reel2.png",
        description: "Explore the breathtaking views of the high mountains."
    },
    {
        id: "2",
        title: "Ocean Breeze",
        image: "/images/reel.png",
        description: "Relax by the calm and soothing waves of the ocean."
    },
    {
        id: "3",
        title: "Forest Path",
        image: "/images/reel3.png",
        description: "Walk through the dense and vibrant green forest."
    }

]