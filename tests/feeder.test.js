function calculateFeedAmount(fishWeightGrams) {
    if (fishWeightGrams <= 0) return 0;
    return fishWeightGrams * 0.05;
}

test('Menghitung takaran pakan ikan', () => {
    expect(calculateFeedAmount(100)).toBe(5);
});
