/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function () {
  return {
    logo: require('@/Assets/Images/logo.png'),
    bg: require('@/Assets/Images/bg.png'),
    loading: require('@/Assets/Images/loading.gif'),
    user: require('@/Assets/Images/user.png'),
  };
}
