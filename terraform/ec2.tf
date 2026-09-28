resource "aws_instance" "flightwatch_backend" {
  ami           = "ami-050c78efa486a0196"
  instance_type = "t3.micro"

  subnet_id = aws_subnet.flightwatch_public_subnet.id
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
  vpc_security_group_ids = [
    aws_security_group.flightwatch_security_group.id
  ]

  key_name = "flightwatch-key"

  tags = {
    Name = "flightwatch-backend"
  }
}