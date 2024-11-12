# Get the aliases and functions  
if [ -f ~/.bashrc ]; then  
. ~/.bashrc  
fi  
# User specific environment and startup programs  
readonly PATH=$HOME/programs  
export PATH
alias k=kubectl
complete -F __start_kubectl k