# Feature 2: Mobile Integration Guide - Popularity Tracking

**For:** Cursor AI / Mobile Developer  
**Repo:** https://github.com/yashhb23/FreshRoots  
**Mobile Path:** `fresh_roots_mobile`  
**Status:** Backend Complete ✅ | Mobile Pending ⏳

---

## 🎉 What the Backend Now Supports

### New Database Fields on Listings

Every product/listing now has:

| Field | Type | Description |
|---|---|---|
| `view_count` | number | How many times product detail was viewed |
| `order_count` | number | How many times product was ordered |
| `popularity_score` | number | Calculated score (higher = more popular) |
| `last_ordered_at` | string/null | ISO timestamp of last order |

---

### Automatic Tracking

**View Tracking:**
- ✅ Happens automatically when `GET /api/listings/:id` is called
- ✅ No mobile code changes needed
- ✅ Just fetch product detail as usual, backend handles counting

**Order Tracking:**
- ✅ Happens automatically when order is placed
- ✅ No mobile code changes needed
- ✅ Backend updates `order_count` and `last_ordered_at` automatically

---

### Popular Sorting Now Works!

**Before:** `sortBy=popular` was a placeholder  
**Now:** `sortBy=popular` returns truly popular products

**Example:**
```typescript
const response = await api.get('/listings', {
  params: { sortBy: 'popular', limit: 10 }
});
// Returns top 10 most popular products based on views, orders, and recency
```

---

## 🎯 What You Need to Build

### 1. "Popular Products" Section on HomeScreen

**Design:**

```
┌────────────────────────────────────────┐
│  Popular Products  [View All →]       │
├────────────────────────────────────────┤
│                                        │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐      │
│  │ 🥒 │  │ 🍅 │  │ 🥕 │  │ 🥬 │  →   │
│  │Rs45│  │Rs85│  │Rs50│  │Rs35│      │
│  └────┘  └────┘  └────┘  └────┘      │
│                                        │
└────────────────────────────────────────┘
```

**Implementation:**

```typescript
// In HomeScreen.tsx
import { useEffect, useState } from 'react';
import { fetchListings } from '@/services/api/listings';

const HomeScreen = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    loadPopularProducts();
  }, []);

  const loadPopularProducts = async () => {
    try {
      const response = await fetchListings({
        sortBy: 'popular',
        limit: 10,
      });
      setPopularProducts(response.data);
    } catch (error) {
      console.error('Failed to load popular products:', error);
    }
  };

  return (
    <View>
      {/* Other sections */}
      
      <View style={styles.popularSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PopularProducts')}>
            <Text style={styles.viewAll}>View All →</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={popularProducts}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              badge="Popular"  // Optional badge
              onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};
```

---

### 2. "View All" Popular Products Screen (Optional)

**Create:** `PopularProductsScreen.tsx`

**Purpose:** Show all popular products in a scrollable list

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

const PopularProductsScreen = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['popularProducts'],
    queryFn: ({ pageParam = 1 }) =>
      fetchListings({
        sortBy: 'popular',
        page: pageParam,
        limit: 20,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.page + 1 : undefined,
  });

  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <FlatList
      data={allProducts}
      renderItem={({ item }) => <ProductListItem product={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator /> : null
      }
    />
  );
};
```

---

### 3. Show "Popular" Badge on Products

**Badge Criteria:**
- `popularity_score >= 50` → Show "🔥 Popular" badge
- Or top 10% of products by score

**Implementation:**

```typescript
const ProductCard = ({ product }) => {
  const isPopular = product.popularity_score >= 50;

  return (
    <View style={styles.card}>
      {isPopular && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🔥 Popular</Text>
        </View>
      )}
      
      <Image source={{ uri: product.images[0]?.image_url }} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>Rs {product.price}</Text>
    </View>
  );
};
```

---

### 4. Display Popularity Stats on Product Detail (Optional)

**Show:**
- View count ("👁️ 120 views")
- Order count ("🛒 15 sold")

**Implementation:**

```typescript
const ProductDetailScreen = ({ route }) => {
  const { product } = route.params;

  return (
    <ScrollView>
      <Image source={{ uri: product.images[0]?.image_url }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>Rs {product.price}</Text>
      </View>

      {/* Popularity Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>👁️</Text>
          <Text style={styles.statText}>{product.view_count} views</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statIcon}>🛒</Text>
          <Text style={styles.statText}>{product.order_count} sold</Text>
        </View>
      </View>

      {/* Rest of product details */}
    </ScrollView>
  );
};
```

---

### 5. No Code Changes Needed For:

✅ **View Tracking** - Backend handles it automatically  
✅ **Order Tracking** - Backend handles it automatically  
✅ **Popularity Calculation** - Admin endpoint (backend only)

Just display the data that's already in the API responses!

---

## 📱 Updated API Response Format

### Listings Response

All listing objects now include:

```typescript
interface Listing {
  id: string;
  title: string;
  price: number;
  stock: number;
  // ... existing fields
  
  // NEW FIELDS
  view_count: number;              // Number of views
  order_count: number;             // Number of orders
  popularity_score: number;        // Calculated score
  last_ordered_at: string | null;  // ISO timestamp or null
}
```

**Example Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Cucumber",
      "price": 45,
      "stock": 55,
      "view_count": 120,
      "order_count": 15,
      "popularity_score": 82.5,
      "last_ordered_at": "2026-03-15T10:30:00Z",
      "images": [...],
      "category": {...}
    }
  ],
  "meta": {...}
}
```

---

## 🧪 Testing Checklist

After implementation, verify:

### View Tracking
- [ ] Navigate to product detail page
- [ ] Check backend: view_count increments
- [ ] Navigate away and back: view_count increments again

### Popular Products Section
- [ ] "Popular Products" section appears on HomeScreen
- [ ] Shows horizontal scrollable list of products
- [ ] Products sorted by popularity_score (highest first)
- [ ] "View All" button navigates to PopularProductsScreen

### Popular Badge
- [ ] Products with high popularity_score show "🔥 Popular" badge
- [ ] Badge appears on ProductCard
- [ ] Badge styling matches design system

### Order Tracking
- [ ] Place an order
- [ ] Check product detail: order_count increments
- [ ] Check product detail: last_ordered_at updated

### Sort by Popular
- [ ] Use filters modal with sortBy="popular"
- [ ] Results show most popular products first
- [ ] Sorting works correctly

---

## 💡 Design Recommendations

### Popular Badge Styling

```typescript
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
```

### Stats Display

```typescript
const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
});
```

---

## 🔄 Migration Notes

**Database Migration:** Already applied on backend  
**API Breaking Changes:** None - all new fields are additions  
**Backward Compatibility:** ✅ Full - existing code continues to work

---

## 📊 Popularity Score Explained

**Formula:**
```
score = (order_count × 10) + (view_count × 0.5) + recency_bonus

where:
  recency_bonus = {
    10 points: last ordered 0-7 days ago
    5 points:  last ordered 8-30 days ago
    0 points:  last ordered 31+ days ago or never
  }
```

**Examples:**

| Product | Views | Orders | Last Order | Calculation | Score |
|---|:---:|:---:|---|---|:---:|
| Cucumber | 100 | 5 | 3 days ago | (5×10) + (100×0.5) + 10 | **110** |
| Tomato | 200 | 0 | Never | (0×10) + (200×0.5) + 0 | **100** |
| Lettuce | 50 | 2 | 10 days ago | (2×10) + (50×0.5) + 5 | **45** |

**Interpretation:**
- Score > 100: Very popular (many orders)
- Score 50-100: Moderately popular (decent views, some orders)
- Score < 50: Less popular (few views/orders)

---

## 🚀 Implementation Order

**Day 1:**
1. Add "Popular Products" section to HomeScreen
2. Fetch and display popular products
3. Test view tracking (automatic)

**Day 2:**
4. Add "Popular" badge to ProductCard
5. Create PopularProductsScreen (View All)
6. Test sorting by popular

**Day 3:**
7. Add popularity stats to ProductDetailScreen (optional)
8. Polish UI/UX
9. Test order tracking (automatic)

---

## 🎨 UI/UX Considerations

### "Popular" Section Placement

Recommended order on HomeScreen:
1. Banner/Carousel (if exists)
2. **Popular Products** ← Add here
3. Categories
4. All Products / Newest

### Loading States

```typescript
if (isLoadingPopular) {
  return <SkeletonLoader count={5} />;
}

if (popularProducts.length === 0) {
  return (
    <EmptyState
      icon="📊"
      title="No popular products yet"
      message="Check back soon as products gain popularity!"
    />
  );
}
```

### Refresh Behavior

- Popular products should refresh when user pulls to refresh on HomeScreen
- Re-fetch after placing an order (to see updated order_count)

---

## 🐛 Edge Cases to Handle

### 1. All Products Have Score 0

**Scenario:** New marketplace with no views/orders yet  
**Solution:** Show fallback to newest products

```typescript
const loadPopularProducts = async () => {
  const popular = await fetchListings({ sortBy: 'popular', limit: 10 });
  
  // If all scores are 0, fallback to newest
  const allZero = popular.data.every(p => p.popularity_score === 0);
  if (allZero) {
    const newest = await fetchListings({ sortBy: 'created_desc', limit: 10 });
    setPopularProducts(newest.data);
  } else {
    setPopularProducts(popular.data);
  }
};
```

### 2. View Count Inflation

**Issue:** User refreshes product page many times  
**Impact:** View count may be higher than actual unique viewers  
**Solution:** Inform user this is expected behavior (or implement throttling in future)

---

## 📱 Mobile TypeScript Types

**Update your types:**

```typescript
// types/listing.ts
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  category_id: string | null;
  location: string | null;
  tags: string[];
  is_active: boolean;
  admin_id: string;
  created_at: string;
  updated_at: string;
  
  // NEW - Popularity tracking
  view_count: number;
  order_count: number;
  popularity_score: number;
  last_ordered_at: string | null;
  
  // Relations
  images: ListingImage[];
  category?: Category;
  admin?: {
    id: string;
    name: string;
  };
}
```

---

## ❓ Questions?

If you encounter issues:

1. **Views not incrementing?**
   - Check network tab: is `GET /listings/:id` being called?
   - Backend increments automatically on every call

2. **Popularity score always 0?**
   - Admin needs to run `POST /admin/recalculate-popularity`
   - Scores are calculated in batch, not real-time

3. **Sort by popular not working?**
   - Verify `sortBy=popular` is in query params
   - Check if popularity_score field exists in response

---

**Backend Status:** ✅ Complete  
**Mobile Status:** ⏳ Awaiting Implementation  
**Ready for Integration:** ✅ Yes  
**Next Backend Feature:** Location Management (user delivery addresses)
