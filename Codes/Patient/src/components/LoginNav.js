import Welcome from '../screens/Welcome';
import Register from '../screens/Register';
import Login from '../screens/Login';
import { createStackNavigator} from 'react-navigation';

const LoginNav=createStackNavigator({
    Welcome,
    Login,
    Register,
    },{
    headerMode:'none'
})
export default LoginNav