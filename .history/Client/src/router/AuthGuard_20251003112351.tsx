import { useAppSelector } from "../store/store";

export default function AuthGuard(){
    const{user}=useAppSelector(state=>state.account);
    
}