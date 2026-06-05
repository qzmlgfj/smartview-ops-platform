FROM alpine:latest
RUN apk add --no-cache openssh && \
    ssh-keygen -A && \
    echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config && \
    echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config && \
    echo 'root:P@ssFrp2024' | chpasswd && \
    mkdir -p /run/sshd && \
    mkdir -p /root

# Flag — the ultimate target of lateral movement
RUN echo 'flag{frp_lateral_pwned_2024}' > /root/flag.txt && \
    echo 'Welcome to the internal network jumpbox.' > /etc/motd && \
    echo 'Last login: Wed Jun  4 08:23:15 2026 from 10.0.0.2' >> /etc/motd

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D", "-e"]
