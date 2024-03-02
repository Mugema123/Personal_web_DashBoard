// component
import SvgColor from "../../../components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1, background: "#008D41" }}
  />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    itemRole: "all"
  },
  {
    title: 'users',
    path: '/dashboard/users',
    icon: icon('ic_user'),
    itemRole: "all"
  },
  {
    title: 'projects',
    path: '/dashboard/projects',
    icon: icon('ic_cart'),
    itemRole: "all"
  },
  {
    title: 'blogs',
    path: '/dashboard/blogs',
    icon: icon('ic_blog'),
    itemRole: "all"
  },
  {
    title: 'testimonials',
    path: '/dashboard/testimonials',
    icon: icon('ic_testimony'),
    itemRole: "all"
  },
  {
    title: 'services',
    path: '/dashboard/services',
    icon: icon('ic_service'),
    itemRole: "all"
  },

];

export default navConfig;
