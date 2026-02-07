create or replace function public.place_order()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_order_id uuid;
  v_total numeric;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if not exists (
    select 1 from public.cart_items where user_id = v_user_id
  ) then
    raise exception 'cart_empty';
  end if;

  if exists (
    select 1
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    where ci.user_id = v_user_id
      and (p.stock is null or ci.quantity > p.stock)
  ) then
    raise exception 'insufficient_stock';
  end if;

  select coalesce(sum((p.price * ci.quantity)), 0)
    into v_total
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_user_id;

  insert into public.orders (user_id, status, total_amount)
  values (v_user_id, 'created', v_total)
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, size, quantity, unit_price)
  select v_order_id, ci.product_id, ci.size, ci.quantity, p.price
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  where ci.user_id = v_user_id;

  update public.products p
  set stock = p.stock - ci.quantity
  from public.cart_items ci
  where ci.user_id = v_user_id
    and p.id = ci.product_id;

  delete from public.cart_items where user_id = v_user_id;

  return v_order_id;
end;
$$;

revoke all on function public.place_order() from public;
grant execute on function public.place_order() to authenticated;
