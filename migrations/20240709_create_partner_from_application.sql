-- Create or replace a function to approve a partner application and create a partner row
create or replace function public.create_partner_from_application(app_id uuid)
returns void as $$
declare
  app record;
begin
  -- Fetch the application
  select * into app from partner_applications where id = app_id;
  if not found then
    raise exception 'Application not found';
  end if;
  if app.status <> 'approved' then
    raise exception 'Application must be approved before creating partner';
  end if;
  -- Insert into partners if not already present
  if not exists (select 1 from partners where user_id = app.user_id) then
    insert into partners (
      user_id, name, address, email, created_at, is_demo
    ) values (
      app.user_id,
      app.business_name,
      app.address,
      app.email,
      now(),
      coalesce(app.is_demo, false)
    );
  end if;
end;
$$ language plpgsql security definer;
