-- BLISS BASKET Shopping Cart and Wishlist Database Migration
-- Table definitions and Row Level Security for Carts, Cart Items, Wishlists, and Wishlist Items

-- 1. CARTS TABLE
CREATE TABLE IF NOT EXISTS public.carts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_session_id text,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'merged', 'converted', 'abandoned')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique index to guarantee one active cart per authenticated user
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_user_cart 
    ON public.carts(user_id) 
    WHERE user_id IS NOT NULL AND status = 'active';

-- Unique index to guarantee one active cart per guest session token
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_guest_cart 
    ON public.carts(guest_session_id) 
    WHERE guest_session_id IS NOT NULL AND status = 'active';

CREATE INDEX IF NOT EXISTS idx_carts_user ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_guest ON public.carts(guest_session_id);

-- 2. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id uuid NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id text NOT NULL,
    quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0 AND quantity <= 10),
    unit_price numeric(10,2) NOT NULL CHECK (unit_price >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.cart_items(cart_id);

-- 3. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_user_wishlist UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);

-- 4. WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wishlist_id uuid NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
    product_id text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_wishlist_product UNIQUE (wishlist_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist ON public.wishlist_items(wishlist_id);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Carts policies
CREATE POLICY "Users can view their own carts" 
    ON public.carts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own carts" 
    ON public.carts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own carts" 
    ON public.carts FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own carts" 
    ON public.carts FOR DELETE 
    USING (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can view their own cart items" 
    ON public.cart_items FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.carts 
            WHERE carts.id = cart_items.cart_id 
              AND carts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own cart items" 
    ON public.cart_items FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.carts 
            WHERE carts.id = cart_items.cart_id 
              AND carts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own cart items" 
    ON public.cart_items FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.carts 
            WHERE carts.id = cart_items.cart_id 
              AND carts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own cart items" 
    ON public.cart_items FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.carts 
            WHERE carts.id = cart_items.cart_id 
              AND carts.user_id = auth.uid()
        )
    );

-- Wishlists policies
CREATE POLICY "Users can manage their own wishlist" 
    ON public.wishlists FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Wishlist items policies
CREATE POLICY "Users can manage their own wishlist items" 
    ON public.wishlist_items FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.wishlists 
            WHERE wishlists.id = wishlist_items.wishlist_id 
              AND wishlists.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.wishlists 
            WHERE wishlists.id = wishlist_items.wishlist_id 
              AND wishlists.user_id = auth.uid()
        )
    );

-- Table level DML grants to authenticated and service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carts TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlists TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wishlist_items TO authenticated, service_role;
