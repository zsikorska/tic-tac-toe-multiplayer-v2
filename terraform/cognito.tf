resource "aws_cognito_user_pool" "ttt_user_pool" {
  name = "ttt_user_pool"
  auto_verified_attributes = ["email"]

  schema {
    attribute_data_type = "String"
    name = "email"
    required = true
    string_attribute_constraints {
        min_length = "1"
        max_length = "100"
    }
  }
}

output "ttt_user_pool_id" {
  value = aws_cognito_user_pool.ttt_user_pool.id
}

resource "aws_cognito_user_pool_client" "ttt_user_pool_client" {
  name                                 = "ttt_user_pool_client"
  user_pool_id                         = aws_cognito_user_pool.ttt_user_pool.id
  callback_urls                        = ["http://localhost:80", "https://${var.frontend_domain}"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_scopes                 = ["email", "openid"]
  supported_identity_providers         = ["COGNITO"]
}

output "ttt_user_pool_client_id" {
  value = aws_cognito_user_pool_client.ttt_user_pool_client.id
}

resource "aws_cognito_user_pool_domain" "ttt_user_pool_domain" {
  domain = "ttt-multiplayer"
  user_pool_id = aws_cognito_user_pool.ttt_user_pool.id
}

output "ttt_user_pool_domain_id" {
  value = aws_cognito_user_pool_domain.ttt_user_pool_domain.id
}
